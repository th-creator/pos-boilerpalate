import '../css/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import HelloWorldApp from '../../examples/hello-world/app';
import LoyaltyApp from '../../examples/loyalty/app';
import TextPrintApp from '../../examples/text-print/app';
import PmsApp from '../../examples/pms/App';
import API from '../../examples/pms/helpers/api';

const alert = 'assignRoom';
class ExampleApp extends React.Component {
    componentDidMount() {
        

        // Poster.interface.showApplicationIconAt({ order: 'Add hotel guest' }); 
        // Poster.interface.showApplicationIconAt({
        //     receiptsArchive:'refund transaction',
        //     order: 'Add hotel guest'
        // });

        // // Bind all events
        // // Poster.on('applicationIconClicked', this.showPopup);
        // Poster.on('applicationIconClicked', async function (data) {
        //     console.log('place',data);
        //     if (data.place === "order") {
        //         this.showPopup
        //     } 
        //     if (data.place === "receiptsArchive") {
        //         await API.refundCustomer(data.order).then(res => {
        //             console.log('status',res);
        //             if(res == true) {
        //                 Poster.interface.showNotification({
        //                     title: 'refund transaction',
        //                     message: 'the order was refunded successfully',
        //                     icon: 'https://png.pngtree.com/png-vector/20230105/ourmid/pngtree-3d-green-check-icon-in-transparent-background-png-image_6552254.png',
        //                 }).then((notification) => {
        //                     console.log('new notification', notification);
        //                 });
        //             }else {
        //                 Poster.interface.showNotification({
        //                     title: 'refund transaction',
        //                     message: 'refund transaction failed',
        //                     icon: 'https://cdn-icons-png.flaticon.com/512/6659/6659895.png',
        //                 }).then((notification) => {
        //                     console.log('new notification', notification);
        //                 });
        //             }
        //         });
        //         // this.setState({ activePage: PAGE_ASSIGN_ROOM }, () => {
                    
                    
        //         // });
        //     } 
        // });
    }
    render() {
        // Чтобы отобразить нужный пример, просто закомментируйте не нужные компоненты

        return <PmsApp />;
        return <HelloWorldApp />;

        return <LoyaltyApp />;

        return <TextPrintApp />;

    }
}

ReactDOM.render(
    <ExampleApp />,
    document.getElementById('app-container'),
);
