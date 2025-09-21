import React from 'react';
import PropType from 'prop-types';

import { Spinner } from 'poster-ui-kit';

import Helper from '../helpers/helper';

const m = Helper.moneyFormat;


export default class PaymentPlace extends React.Component {
    static propTypes = {
        activeOrder: PropType.object,
        activeRoom: PropType.object,
        onPayClicked: PropType.func,
        onPayOnFrontDeskClicked: PropType.func,
        onRefundClicked: PropType.func,
        errorMsg: PropType.string,
        blockButtons: PropType.string, // Блокирует все кнопки и добавляет Spinner
    };

    render() {
        let { activeOrder, activeRoom, onPayClicked, onPayOnFrontDeskClicked,onRefundClicked, error, blockButtons } = this.props;
        let subtotal = activeOrder.total - (activeOrder.platformDiscount || 0);

        return (
            <div className="page-payment-place">
                {error ? <p className="error-msg">{error}</p> : null}
                <h2 className="guest-name">{activeRoom.guestName}</h2>

                <p className="field">Room <span className="value room">{activeRoom.roomName}</span></p>
                <p className="field">Reservation ID <span className="value">{activeRoom.reservationID}</span></p>
                <p className="field">Check out <span className="value">{activeRoom.roomCheckOut}</span></p>

                <div className="total">
                    <p className="field">Sub-total <span className="value">{m(subtotal)}</span></p>
                </div>
                <div className='flex-around'>
                    {/* <button className="btn btn-orange" onClick={() => onRefundClicked('here')} disabled={blockButtons}>
                        Refund
                    </button>
                    <button className="btn btn-orange" onClick={() => onPayOnFrontDeskClicked('here')} disabled={blockButtons}>
                        Pay on front desk
                    </button> */}
                    <button className="btn btn-green" onClick={() => onPayClicked('here')} disabled={blockButtons}>
                        Pay
                    </button>
                </div>
            </div>
        );
    }
}
