import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

export default function AddToCart({ id }) {
  const { openCart } = useCart();
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <button
      disabled={loading}
      type="button"
      onClick={async () => {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await addToCart();
        await sleep(1000);
        openCart();
      }}
    >
      Add{loading && 'ing'} to Cart
    </button>
  );
}
