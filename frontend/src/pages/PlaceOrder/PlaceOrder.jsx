import React, { useContext, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { AuthContext } from '../../context/auth-context';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, food_list, cartItems, clearCart } = useContext(StoreContext);
  const auth = useContext(AuthContext);

  const [formState, setFormState] = useState({
    street: { value: '', isValid: false },
    city: { value: '', isValid: false },
    state: { value: '', isValid: false },
    zip: { value: '', isValid: false },
    country: { value: '', isValid: false },
    phone: { value: '', isValid: false },
    items: { value: [
      {
        title: '',
        price: '',
        quantity: ''
      }
    ], isValid: true },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const inputHandler = (inputId, value, isValid) => {
    
    setFormState((prevState) => {
      const updatedFormState = { ...prevState };
      updatedFormState[inputId] = { value, isValid };
      const isValidForm = Object.values(updatedFormState).every((input) => input.isValid);
      setFormIsValid(isValidForm);
      return updatedFormState;
    });
  };

  
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (formIsValid) {
      try {
        const response = await fetch(`http://localhost:5000/api/order/new/${auth.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            street: formState.street.value,
            city: formState.city.value,
            state: formState.state.value,
            zip: formState.zip.value,
            country: formState.country.value,
            phone: formState.phone.value,
            items: food_list.filter((item) => cartItems[item._id] > 0).map((item) => (
              {
                title: item.name,
                price: item.price,
                quantity: cartItems[item._id], 
              })
            )
          })
        });
        const responseData = await response.json();
        if(!response.ok) {
          throw new Error(
            responseData.message || 'Order not placed'
          );
        }
        else {
          clearCart();
          navigate('/');
        }
      }
      catch(err) {}
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Street"
            value={formState.street.value}
            onChange={(e) =>
              inputHandler('street', e.target.value, e.target.value.trim() !== '')
            }
          />
          <input
            type="text"
            placeholder="City"
            value={formState.city.value}
            onChange={(e) =>
              inputHandler('city', e.target.value, e.target.value.trim() !== '')
            }
          />
          <input
            type="text"
            placeholder="State"
            value={formState.state.value}
            onChange={(e) =>
              inputHandler('state', e.target.value, e.target.value.trim() !== '')
            }
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Zip code"
            value={formState.zip.value}
            onChange={(e) =>
              inputHandler('zip', e.target.value, e.target.value.trim() !== '')
            }
          />
          <input
            type="text"
            placeholder="Country"
            value={formState.country.value}
            onChange={(e) =>
              inputHandler('country', e.target.value, e.target.value.trim() !== '')
            }
          />
        </div>
        <input
          type="text"
          placeholder="Phone"
          value={formState.phone.value}
          onChange={(e) =>
            inputHandler('phone', e.target.value, e.target.value.trim() !== '')
          }
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit" disabled={!formIsValid}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
