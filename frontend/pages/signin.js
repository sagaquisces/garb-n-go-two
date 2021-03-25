import React, { useState } from 'react';
import styled from 'styled-components';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import RequestReset from '../components/RequestReset';

// const SIGNUP_MUTATION = gql`
//   mutation SIGNUP_MUTATION(
//     $name: String!
//     $email: String!
//     $password: String!
//   ) {
//     createUser(data: { email: $email, name: $name, password: $password }) {
//       id
//       email
//       name
//     }
//   }
// `;

const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

export default function SignInPage() {
  const [signedUpUser, setSignedUpUser] = useState({});
  function handleSignUpSubmit(signupObj) {
    console.log('INFO IN PAGE');
    console.log(signupObj);
    if (signupObj?.data?.createUser) {
      setSignedUpUser(signupObj.data.createUser);
    }
  }
  return (
    <GridStyles>
      <SignIn signedUp={signedUpUser} />
      {!signedUpUser.email && <SignUp handleSubmit={handleSignUpSubmit} />}
      {!signedUpUser.email && <RequestReset />}
    </GridStyles>
  );
}
