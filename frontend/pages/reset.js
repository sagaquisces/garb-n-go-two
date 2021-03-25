import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <>
        <p>Sorry you must supply a token</p>
        <RequestReset />
      </>
    );
  }
  return (
    <div>
      <p>Reset your password, fool. {query.token}</p>
      <Reset token={query.token} />
    </div>
  );
}
