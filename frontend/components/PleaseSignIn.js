import PropTypes from 'prop-types';
import SignIn from './SignIn';
import { useUser } from './User';

export default function PleaseSignIn({ children }) {
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
}

PleaseSignIn.propTypes = {
  children: PropTypes.node.isRequired,
};
