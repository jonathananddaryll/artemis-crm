import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';

export default function SignIn() {
  const [demoAccount, setDemoAccount] = useState({
    emailAddress: 'artemisdemoacc@gmail.com',
    password: '@ArtemisDemo'
  });
  const { emailAddress, password } = demoAccount;

  const { signIn, setActive } = useSignIn();
  const handleLogin = async e => {
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password
      });

      if (result.status === 'complete') {
        console.log(result);
        await setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      console.error('error', err.errors[0].longMessage);
    }
  };
  return <button onClick={() => handleLogin()}>Demo Sign In</button>;
}
