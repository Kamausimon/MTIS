import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.patch(
          `${url}/api/v1/businesses/confirmBusiness/${token}`
        );

        console.log('Response:', response);

        // Axios wraps the response data in "data" property
        const { data } = response;

        if (response.status >= 200 && response.status < 300) {
          alert(data.message);
          navigate(`/create-admin/${data.business}/${data.businessCode}`);
        } else {
          alert(data.message || 'Error confirming email.');
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response) {
          // Server responded with non-2xx status
          alert(error.response.data.message || 'Confirmation failed');
        } else {
          alert('Network error. Please try again later.');
        }
      }
    };

    if (token) confirmEmail();
  }, [token, navigate]);

  return <p>Confirming your email...</p>;
};

export default ConfirmEmail;