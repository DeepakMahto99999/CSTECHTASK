import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const AddAgent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/add-agent',
        { name, email, password, mobile },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setName('');
        setEmail('');
        setPassword('');
        setMobile('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }
  };

  return (
    <div className="m-5 w-full">
      <form onSubmit={onSubmitHandler}>
        <p className="mb-3 text-lg font-medium">Add Agent</p>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Agent Name</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="border p-2 rounded"/>
            </div>

            <div className="flex flex-col gap-1">
              <p>Agent Email</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="border p-2 rounded"/>
            </div>

            <div className="flex flex-col gap-1">
              <p>Agent Password</p>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="border p-2 rounded"/>
            </div>

            <div className="flex flex-col gap-1">
              <p>Mobile Number</p>
              <PhoneInput
                country={'in'} // default country
                value={mobile}
                onChange={phone => setMobile('+' + phone)}
                inputClass="w-full border p-2 rounded"
                containerClass="w-full"
                enableSearch
                placeholder="Enter mobile number"
              />
            </div>

            <div className="mt-6">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Add Agent
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAgent;
