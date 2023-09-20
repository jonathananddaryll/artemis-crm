import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import styles from './DemoSignIn.module.scss';

export default function DemoSignIn() {
  // const [demoAccount, setDemoAccount] = useState({
  //   emailAddress: 'artemisdemoacc@gmail.com',
  //   password: '@ArtemisDemo'
  // });

  const demoAccount = {
    emailAddress: 'artemisdemoacc@gmail.com',
    password: '@ArtemisDemo'
  };

  const navigate = useNavigate();

  const { emailAddress, password } = demoAccount;
  const { signIn, setActive } = useSignIn();

  const handleLogin = async e => {
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/boards');
      }
    } catch (err) {
      console.error('error', err.errors[0].longMessage);
    }
  };
  return (
    <button className={styles.demoButton} onClick={() => handleLogin()}>
      View Demo Account
    </button>
  );
}
