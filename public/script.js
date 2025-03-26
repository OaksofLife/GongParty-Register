document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const province = document.getElementById('province').value;
    const postalCode = document.getElementById('postal-code').value;
    const dob = document.getElementById('dob').value;
    const citizen = document.getElementById('citizen').checked;
    const pr = document.getElementById('pr').checked;
    const disclosure = document.getElementById('disclosure').checked;
  
    if (!citizen && !pr) {
      alert('Please select your citizenship status.');
      return;
    }
  
    if (!disclosure) {
      alert('You must agree to the disclosure.');
      return;
    }

    const formData = {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        address,
        city,
        province,
        postalCode,
        dateOfBirth: dob,
        citizenship: citizen ? 'Citizen' : 'PR',
      };
    
      // Send form data to the server
      fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => {
        if (response.ok) {
          alert(`Thank you for registering, ${firstName} ${lastName}!`);
          document.getElementById('registration-form').reset(); 
        } else {
          alert('Error submitting the form. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error submitting the form. Please try again.');
      });
    });
  