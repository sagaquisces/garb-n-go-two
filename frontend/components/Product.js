import Link from 'next/link';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import AddToCart from './AddToCart';
import DeleteProduct from './DeleteProduct';
import ItemStyles from './styles/ItemStyles';
import PriceTagStyles from './styles/PriceTagStyles';
import TitleStyles from './styles/TitleStyles';
import { useUser } from './User';

export default function Product({ product }) {
  const user = useUser();
  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
      />
      <TitleStyles>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </TitleStyles>
      <PriceTagStyles>{formatMoney(product.price)}</PriceTagStyles>
      <p>{product.description}</p>
      {user && (
        <div className="buttonList">
          <Link
            href={{
              pathname: 'update',
              query: {
                id: product.id,
              },
            }}
          >
            <button type="button">Edit</button>
          </Link>
          <AddToCart id={product.id} />
          <DeleteProduct product={product}>Delete</DeleteProduct>
        </div>
      )}
    </ItemStyles>
  );
}

Product.propTypes = {
  product: PropTypes.object,
};
