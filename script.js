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
  
    alert(`Thank you for registering, ${firstName} ${lastName}!`);
  });
  