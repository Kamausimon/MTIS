import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const url = process.env.REACT_APP_API_URL;

const ConfirmEmail = () => {
  const { token } = useParams(); // Extract the token from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`${url}/api/v1/businesses/confirmEmail/${token}`, {
          method: 'PATCH',
        });

        console.log('response',response);

        const data = await response.json();
        console.log('data',data);

        if (response.ok) {
          alert(data.message);
          navigate(`/create-admin/${data.business}/${data.businessCode}`); // Redirect to the next step
        } else {
          alert(data.message || 'Error confirming email.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
      }
    };

    if (token) {
      confirmEmail();
    }
  }, [token, navigate]);

  return <p>Confirming your email...</p>;
};

export default ConfirmEmail;
