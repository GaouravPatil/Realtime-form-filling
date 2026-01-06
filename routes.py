from flask import Blueprint, request, jsonify
from models import db, FormSubmission
from datetime import datetime
import re

api = Blueprint('api', __name__)

def validate_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def validate_phone(phone):
    return re.match(r"^\+?[0-9\s\-]{10,20}$", phone)

@api.route('/submit', methods=['POST'])
def submit_form():
    data = request.json
    
    # Validation
    errors = {}
    if not data.get('full_name'):
        errors['full_name'] = 'Full Name is required'
    if not data.get('designation'):
        errors['designation'] = 'Designation is required'
    if not data.get('dob'):
        errors['dob'] = 'Date of Birth is required'
    if not data.get('skills'):
        errors['skills'] = 'At least one skill is required'
    
    if not data.get('email'):
        errors['email'] = 'Email is required'
    elif not validate_email(data['email']):
        errors['email'] = 'Invalid email format'
        
    if not data.get('phone'):
        errors['phone'] = 'Phone number is required'
    elif not validate_phone(data['phone']):
        errors['phone'] = 'Invalid phone number'
        
    if not data.get('address'):
        errors['address'] = 'Address is required'

    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        dob_date = datetime.strptime(data['dob'], '%Y-%m-%d').date()
        
        # Handle array or string input for skills
        skills_val = data['skills']
        if isinstance(skills_val, list):
            skills_val = ", ".join(skills_val)

        new_submission = FormSubmission(
            full_name=data['full_name'],
            designation=data['designation'],
            dob=dob_date,
            skills=skills_val,
            email=data['email'],
            phone=data['phone'],
            address=data['address']
        )
        
        db.session.add(new_submission)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Form submitted successfully!',
            'id': new_submission.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api.route('/submissions', methods=['GET'])
def get_submissions():
    submissions = FormSubmission.query.order_by(FormSubmission.created_at.desc()).all()
    return jsonify([sub.to_dict() for sub in submissions])
