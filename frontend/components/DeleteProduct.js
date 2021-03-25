import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ product, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id: product.id },
    update,
  });

  return (
    <button
      type="button"
      onClick={() => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Are you sure you want to delete ${product.name}`)) {
          console.log('deleted');
          deleteProduct().catch((error) => alert(error.message));
        }
      }}
      disabled={loading}
    >
      {children}
    </button>
  );
}

DeleteProduct.propTypes = {
  product: PropTypes.any,
  children: PropTypes.any,
};
