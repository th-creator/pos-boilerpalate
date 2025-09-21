import './css/main.scss';

import React from 'react';

import API from './helpers/api';
import Storage from './helpers/storage';

import AssignRoom from './views/AssignRoom';
import PaymentPlace from './views/PaymentPlace';


const PAGE_ASSIGN_ROOM = 'assignRoom';
const PAGE_PAYMENT_PLACE = 'paymentPlace';
const PAGE_Refund_CUSTOMER = 'RefundCustomer';


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeRoom: null,
            activeOrder: null,
        };

        const extras = Poster.settings.extras || {};

        // Here we will init API
        API.setParams({ posterToken: extras.posterToken });

        console.log('---> PMS loaded', Poster.settings.spotId);
    }

    componentDidMount() {
        
        // Poster.interface.showApplicationIconAt({
        //     functions: 'App settings',
        //     order: 'App popup',
        // });

        // Poster.interface.showApplicationIconAt({ order: 'Add hotel guest' }); 

        // Bind all events
        Poster.on('afterPopupClosed', this.closePopup);
        // Poster.on('applicationIconClicked', this.showPopup);
        // Poster.on('applicationIconClicked', function (data) {
        //     console.log('place',data);
        //     if (data.place === "order") {
        //         this.showPopup
        //     } 
        // });
        Poster.interface.showApplicationIconAt({
            receiptsArchive:'refund transaction',
            order: 'Add hotel guest'
        });

        // Bind all events
        // Poster.on('applicationIconClicked', this.showPopup);
        Poster.on('applicationIconClicked', async (data) => {
            console.log('place',data);
            if (data.place === "order") {
                console.log('asign',data); 
                this.setState({ activePage: PAGE_ASSIGN_ROOM }, () => {
                    Poster.interface.popup({
                        title: 'Assign hotel guest',
                        width: '60%',
                        height: 328,
                    });
                }); 
            }  
            if (data.place === "receiptsArchive") {
                await API.refundCustomer(data.order).then(res => {
                    console.log('status',res);
                    if(res == true) {
                        Poster.interface.showNotification({
                            title: 'refund transaction',
                            message: 'the order was refunded successfully',
                            icon: 'https://png.pngtree.com/png-vector/20230105/ourmid/pngtree-3d-green-check-icon-in-transparent-background-png-image_6552254.png',
                        }).then((notification) => {
                            console.log('new notification', notification);
                        });
                    }else {
                        Poster.interface.showNotification({
                            title: 'refund transaction',
                            message: 'refund transaction failed',
                            icon: 'https://cdn-icons-png.flaticon.com/512/6659/6659895.png',
                        }).then((notification) => {
                            console.log('new notification', notification);
                        });
                    }
                });
                // this.setState({ activePage: PAGE_ASSIGN_ROOM }, () => {
                    
                    
                // });
            }  
        });
        Poster.on('beforeOrderClose', this.beforeOrderClose);
        Poster.on('afterOrderClose', this.afterOrderClose);
        Poster.on('onPayFrontDesk', this.onPayFrontDesk);
    }

    /**
     * Unmount all views
     */
    closePopup = () => {
        this.setState({
            errorMsg: null,
            activePage: null,
            blockButtons: null,
            next: null,
        });
    };

    /**
     *
     */
    showPopup = () => {
        this.setState({ activePage: PAGE_ASSIGN_ROOM }, () => {
            Poster.interface.popup({
                title: 'Assign hotel guest',
                width: '60%',
                height: 328,
            });
        });
    };  
    showChoose = (val = null) => {
        // console.log('customer');
        // console.log('cus',val);
        // Poster.interface.closePopup();
        this.setState({ activePage: PAGE_Refund_CUSTOMER }, () => {
            Poster.interface.popup({
                title: 'Choose method',
                width: '60%',
                height: 328,
            });
        });
    };

    beforeOrderClose = (data, next) => {
        const { order } = data;
        console.log('next /',next);

        var reservation = Storage.get(`order${order.id}`);
        console.log('order',order);
        console.log('reservation',reservation);
        
        if (!reservation) {
            console.warn('skipped order reservation for order', order.id);
            reservation = {
                id: order.id,
                guestID: -1,
                guestName: 'PASSER',
                reservationID: '',
                roomCheckIn: '',
                roomCheckOut: '',
                roomID: '',
                roomName: ''
            }
            console.log('reservation',reservation);
            this.setState({
                activePage: PAGE_PAYMENT_PLACE,
                activeRoom: reservation,
                activeOrder: order,
                next,
            })
            // this.showChoose()
            next();
            return;
        }
        this.setState({
            activePage: PAGE_PAYMENT_PLACE,
            activeRoom: reservation,
            activeOrder: order,
            next,
        }, () => {
            Poster.interface.popup({
                title: 'Choose payment place',
                width: 500,
                height: 370,
            });
        });
    };

    /**
     * Group data about items in orders
     *
     * @param data
     */
    afterOrderClose = async (data) => {
        const { order, paymentPlace } = data;
        console.log('order:::',order);
        console.log('data:::',data);
        const products = [];
        var reservation = Storage.get(`order${order.id}`);
        const discount = order.subtotal - order.total + (order.platformDiscount || 0);
        var flag = true;
        if (!reservation) {
            flag = false
            reservation ={
                id: order.id,
                guestID: -1,
                guestName: 'PASSER',
                reservationID: '',
                roomCheckIn: '',
                roomCheckOut: '',
                roomID: '',
                roomName: ''
            }
        }
        console.log('this is start',reservation);

        for (const i in Object.values(order.products)) {
            const product = await Poster.products.getFullName(order.products[i]);
            const model = await Poster.products.get(product.id);

            // If discount applied to the order we should calculate price with discount
            if (product.promotionPrice !== undefined) {
                product.price = product.promotionPrice;
            }

            // Вычитаем скидку на заказ
            product.price -= product.price / order.subtotal * discount;
            product.tax = 0;

            // Here we will calculate total tax value, but product price will be only for 1 item
            // E.g. for 2 donuts price field will contain 1 donut price and tax field will contain whole taxes sum for 2 donuts

            // Calculate Sales Tax
            if (model.taxType === 1 && model.taxValue) {
                product.tax = product.price * model.taxValue / 100;
            }

            // Calculate VAT. VAT already included in price so we have to subtract it
            if (model.taxType === 3 && model.taxValue) {
                product.tax = product.price - product.price / (1 + model.taxValue / 100);
                product.price -= product.tax;
            }

            // Calculate tax on turnover
            if (model.taxType === 2 && model.taxValue) {
                product.tax = product.price * model.taxValue / 100;
                product.price -= product.tax;
            }

            if (product.tax !== undefined) {
                product.tax *= product.count;
                product.taxName = model.taxName;
            }

            products.push(product);
        }
        console.log('this is prodc',reservation);

        reservation.id = order.id;
        reservation.products = products;
        reservation.spot_tablet_id = order.tableId;
        reservation.paymentMethodId = order.paymentMethodId;
        reservation.payed = true; // Order has been payed at Poster
        reservation.payments = {
            cash: order.payedCash,
            card: order.payedCard,
            bonus: order.payedBonus + order.platformDiscount,
        };
        console.log('this is id',reservation);

        if (!reservation) {
            console.warn('skipped order reservation for order', order.id);
            return;
        }

        !flag ? await API.addOrderToReservation(reservation) : await API.addOrderToHotelRoom(reservation)
        Storage.remove(`order${order.id}`);
    };
    onPayFrontDesk = async (data) => {
        console.log(this.state.activeOrder);
        // const order = data;
        // Poster.interface.closePopup();
        // const { order, paymentPlace } = data;
        const order = this.state.activeOrder
        console.log('order front:::',order);
        const products = [];
        var reservation = Storage.get(`order${order.id}`);
        const discount = order.subtotal - order.total + (order.platformDiscount || 0);

        if (!reservation) {
            console.warn('skipped order reservation for order', order.id);
            return;
        }

        for (const i in Object.values(order.products)) {
            const product = await Poster.products.getFullName(order.products[i]);
            const model = await Poster.products.get(product.id);

            // If discount applied to the order we should calculate price with discount
            if (product.promotionPrice !== undefined) {
                product.price = product.promotionPrice;
            }

            // Вычитаем скидку на заказ
            product.price -= product.price / order.subtotal * discount;
            product.tax = 0;

            // Here we will calculate total tax value, but product price will be only for 1 item
            // E.g. for 2 donuts price field will contain 1 donut price and tax field will contain whole taxes sum for 2 donuts

            // Calculate Sales Tax
            if (model.taxType === 1 && model.taxValue) {
                product.tax = product.price * model.taxValue / 100;
            }

            // Calculate VAT. VAT already included in price so we have to subtract it
            if (model.taxType === 3 && model.taxValue) {
                product.tax = product.price - product.price / (1 + model.taxValue / 100);
                product.price -= product.tax;
            }

            // Calculate tax on turnover
            if (model.taxType === 2 && model.taxValue) {
                product.tax = product.price * model.taxValue / 100;
                product.price -= product.tax;
            }

            if (product.tax !== undefined) {
                product.tax *= product.count;
                product.taxName = model.taxName;
            }

            products.push(product);
        }

        reservation.id = order.id;
        reservation.orderName = order.orderName;
        reservation.spot_id = order.tableId;
        reservation.clientId = order.clientId;
        reservation.products = products;
        reservation.payed = false; // Order refered to hotelrunner
        reservation.payments = {
            cash: order.payedCash,
            card: order.payedCard,
            bonus: order.payedBonus + order.platformDiscount,
        };


        await API.addOrderToHotelRoom(reservation);
        products.map(res => Poster.orders.changeProductCount(order.id, {id: res.id, count: 0}))
        
        Poster.orders.setOrderComment(order.id, null)
        console.log('reservation: ',reservation);
        Storage.remove(`order${order.id}`);
        // const { next } = this.state;
        // this.closePopup()
        Poster.interface.closePopup();
        // this.setState({
        //     activeOrder: null,
        //     activeRoom: null,
        // });
        console.log('state: ',this.state);
        // закрываем чек через окно оплаты
        // window.location.href = '/';
        // next();
    };

    sendPayment = async () => {
        console.log('state',this.state);
        console.log('activeOrder',this.state.activeOrder);
        const { next } = this.state;

        // закрываем чек через окно оплаты
        Poster.interface.closePopup();
        console.log('next :',next);
        next();
    };

    showPopupOnFront = async () => {
        console.log('state',this.state);
        console.log('activeOrder',this.state.activeOrder);
        const { next } = this.state;

        // закрываем чек через окно оплаты
        Poster.interface.closePopup();
        console.log('next :',next);
        next();
    };

    render() {
        const {
            activePage, activeRoom, activeOrder, blockButtons, errorMsg,
        } = this.state;

        return (
            <div className="main-container">
                {(activePage === PAGE_ASSIGN_ROOM) && (
                    <AssignRoom
                        activeOrder={activeOrder}
                        onPayFrontDesk={this.showPopupOnFront}
                        activeRoom={activeRoom}
                        errorMsg={errorMsg}
                    />
                )}
                {(activePage === PAGE_Refund_CUSTOMER) && (
                    <div className='page-choose-payment' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Please choose a method</h2>
                        {/* <button className="btn btn-orange" onClick={() => this.showPopup()} disabled={blockButtons} style={{ marginBottom: '10px' }}>
                            Pay on front desk
                        </button> */}
                        {/* <button className="btn btn-orange" onClick={() => this.showPopupOnFront()} disabled={blockButtons} style={{ marginBottom: '10px' }}>
                            Pay on front desk
                        </button> */}
                        <button className="btn btn-green1" onClick={() => this.sendPayment('here')} disabled={blockButtons}>
                            Pay here
                        </button>                            
                    </div>
                    
                )}

                {(activePage === PAGE_PAYMENT_PLACE) && (
                    <PaymentPlace
                        activeRoom={activeRoom}
                        activeOrder={activeOrder}
                        onPayClicked={this.sendPayment}
                        onPayOnFrontDeskClicked={this.onPayFrontDesk}
                        blockButtons={blockButtons}
                        error={errorMsg}
                    />
                )}
            </div>
        );
    }
}
