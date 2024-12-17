import React from 'react';
import { Email, Phone } from '@mui/icons-material';

const WebContact = () => {

  return (
    <div className="flex flex-col justify-center items-center p-6 bg-white rounded py-16">
      <div className='sm:p-10 '>
      <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
      <p className="mb-6 text-gray-600">
        I'm always open to discussing new opportunities, collaborations, or just to chat!
      </p>
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center">
          <Email className="text-blue-500 mr-3" />
          <span className="text-lg font-medium text-gray-800">sandipkukadiya194@gmail.com</span>
        </div>
        {/* Phone */}
        <div className="flex items-center">
          <Phone className="text-blue-500 mr-3" />
          <span className="text-lg font-medium text-gray-800">+91 63541 93838</span>
        </div>
      </div>
      {/* Social Media Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Follow Me</h3>
        <div className="flex gap-4">
          <a
            href="https://github.com/imsendyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/sandip-prajapati"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            LinkedIn
          </a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default WebContact;
