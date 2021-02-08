import Link from 'next/link';
import PropTypes from 'prop-types';
import formatMoney from './lib/formatMoney';
import ItemStyles from './styles/ItemStyles';
import PriceTagStyles from './styles/PriceTagStyles';
import TitleStyles from './styles/TitleStyles';

export default function Product({ product }) {
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
      {/* add buttons to add and delete items */}
    </ItemStyles>
  );
}

Product.propTypes = {
  product: PropTypes.object,
};
