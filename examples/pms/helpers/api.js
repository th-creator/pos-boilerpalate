import axios from 'axios';
import manifest from '../../../manifest.json' assert { type: 'json'};
export class DevAPI {
    constructor() {
        this.params = {};
        // this.token= manifest.token;
        // this.hr_id= manifest.hr_id;
        this.token= null;
        this.hr_id= null;
        this.applicationId= manifest.applicationId;
        this.applicationSecret= manifest.applicationSecret;
        this.products= null;
        this.departments= null;
        this.revenue_account= null;
        this.Secondary_revenue_account= null;
        this.subdomain= null;
        this.init()
    }
    async init() {
        await this.getHotelRunnerTokens();
        await this.getDepartments();
        
        
        // this.loopDepartments();
    }
    setParams(params) {
        for (let param in params) {
            if (params.hasOwnProperty(param)) {
                this.params[param] = params[param];
            }
        }
    }
    async refundCustomer(data) {

        const payload = {
            spot_tablet_id: 1,
            transaction_id: data.orderName,
            user_id: data.userId,
        };
        try {
            var response = null
            await Poster.makeApiRequest(`transactions.removeTransaction`, {
                method: 'post',
                data: payload
            }, async (res) => {
                if (res) {
                    return true;
                } else {
                    console.error("Request failed.");
                }
                return res
            });
            response = await axios.post(`https://app.hotelrunner.com/api/v1/apps/pos/postings/cancel?token=${this.token}&hr_id=${this.hr_id}`,{
                pos_id: data.id,
                transaction_id: "tr"+data.id
            })
            if(response.data.status == 'success') {
                return true
            } else return false;
        } catch (error) {
            console.error('Error while removing order', error);
            return false;
        }
    }

    /** Returns guests in a hotel
     *
     * @returns {Promise}
     */
    getReservations = async () => {
        console.log('Fake API request getReservations');
        var guests = []
        await axios.get(`https://app.hotelrunner.com/api/v1/apps/line_items/in_house?token=${this.token}&hr_id=${this.hr_id}`)
                    .then(res => {
                        if(res.data) {
                            console.log('guests : ',res.data);
                            res.data.data.map(val => {
                                const parts = val.reservation_id_customer_id.split(':');
                                guests.push({
                                guestID: parts[1],
                                guestName: val.customer_name,
                                reservationID: parts[0],
                                roomCheckIn: val.checkin_date,
                                roomCheckOut: val.checkout_date,
                                roomID: val.room_id,
                                roomName: val.room_identifier
                            })})
                        }
                    })
        return new Promise((resolve, reject) => {
            resolve({
                success: true,
                data: guests
            });
        });
    };
    getDepartments = async () => {
        console.log('Fake API request getDepartments');
        
        console.log('---> PMS loaded', Poster.settings);

        await axios.get(`https://records.dextracommunication.com/api/all/departments/products/${Poster.settings.accountUrl}`)
                    .then(async res => {
                        console.log('revenue accs:',res);
                        
                        this.departments = res.data.records
                        this.revenue_account = res.data?.revenues?.find(val => val.location_id == Poster.settings.spotId)
                        if (!res.data || !res.data.revenues || res.data.revenues.length == 0) {
                            await axios.get(`https://app.hotelrunner.com/api/v1/apps/revenue_accounts?token=${this.token}&hr_id=${this.hr_id}`)
                                        .then(res => {
                                            if(res.data) {
                                                console.log('departments : ',res.data);
                                                res.data.data.map(val => {
                                                    if(val.name.toLowerCase().includes('f') && val.name.toLowerCase().includes('b') && val.name.length < 4) {
                                                        console.log(val);
                                                        this.Secondary_revenue_account = {
                                                            api_code: val.api_code,
                                                            department_api_code: val.sales_departments[0].api_code,
                                                        }
                                                    }})
                                                
                                            }
                                        })
                        }
                    })
                    this.products = await Poster.products.getAll();
                    
        // return daparts
    };
    getHotelRunnerTokens = async () => {
        console.log('Fake API request getHotelRunnerTokens');
        
        console.log('---> PMS settings', Poster.settings.accountUrl);
        await axios.get(`https://records.dextracommunication.com/api/records/${Poster.settings.accountUrl}`)
                    .then(res => {
                        this.token = res.data[res.data.length-1].token
                        this.hr_id = res.data[res.data.length-1].hr_code
                      }
                    )
        
        return 
    };


    /**
     * Send order to PMS
     *
     * @param params {{reservationID: number, itemPaid, items: array, payments: array}}
     * @returns {*}
     */
    addOrderToReservation = async (params) => {
        console.log('Fake API request addOrderToReservation > ', params);
        
        var department = {}
        var res = false
        if (params.products) {
            var method = params.payments.cash > 0 ? 'cash' : params.payments.card > 0 ? 'card' : ''
            
            // this.departments.forEach( async val => {
            //     if(val.type.toLowerCase() == 'payment' && val.name.toLowerCase().includes(method)) {
            //         console.log(val);
                    // department = {
                    //     revenue_account_id: val.revenue_account_id,
                    //     department_id: val.department_id,
                    //     // type: val.type
                    // }
                    res = await this.sendRequest(params,'expense','Payment')
                    // console.log(res);
                    // res = await this.sendRequest(params,department)
                    return 
            //     }
            // })
        }
        return new Promise((resolve, reject) => {
            resolve({ success: res });
        });
    };
    addOrderToHotelRoom = async (params) => {
        console.log('Fake API request addOrderToHotelRoom > ', params);
        var res = false
        if (params.products) {
            // this.departments.forEach(async val => {
                // if(val.name.toLowerCase().includes('f') && val.name.toLowerCase().includes('b') && val.name.length < 4) {
                //     console.log(val);
                //     var department = {
                //         revenue_account_id: val.revenue_account_id,
                //         department_id: val.department_id,
                //         // type: val.type
                //     }
                    if(params.paymentMethodId == 0 ) {
                        res = await this.sendRequest(params,'expense','Payment')
                    } else res = await this.sendRequest(params,'expense')
                    return 
                // }
            // }) 
        }
        
        return new Promise((resolve, reject) => {
            resolve({ success: res });
        });
    };
    sendRequest = async (params,type,secondType = null) => {
        var payload = {}
        var posts = []
        params.products.map(val => {
            console.log();
            let catId = []
            let dep = null
            catId = this.products?.products?.filter(res => res.id === val.id)
            console.log('catId',catId);
            console.log('this.departments',this.departments);
            if(catId?.length > 0) {
                dep = this.departments.find(res => res.category_id == catId[0].parent)
                console.log('response .departments',dep);
            }
            if (!dep) {
                if(this.revenue_account && this.revenue_account.api_code != '' && this.revenue_account.department_api_code != '') {
                    dep = {revenue_api_code:this.revenue_account.api_code,department_api_code:this.revenue_account.department_api_code}
                } else   dep = {revenue_api_code:this.Secondary_revenue_account.api_code,department_api_code:this.Secondary_revenue_account.department_api_code}
            }
            let amount = val.taxValue == 0 ? val.price : Number(val.price + (val.price * val.taxValue / 100))
            console.log('response .departments',dep);
                posts.push({
                    post_type: type,
                    department_id:dep.department_api_code,
                    revenue_account_id:dep.revenue_api_code,
                    product_id:null,
                    product_name:val.name,
                    quantity:val.count,
                    unit:'Portion',
                    amount:amount,
                    currency:'MAD',
                    exchange_rate:null,
                })
            if(secondType !== null ) {
                posts.push({
                    post_type: secondType,
                    department_id:dep.department_api_code,
                    revenue_account_id:dep.revenue_api_code,
                    product_id:null,
                    product_name:val.name,
                    quantity:val.count,
                    unit:'Portion',
                    amount:amount,
                    currency:'MAD',
                    exchange_rate:null,
                })
            }
        })
        const res_cus = params.guestID == -1 ? -1 :  params.reservationID+':'+params.guestID
        payload = {
            "transaction_id": "tr"+params.id,
            "invoice_number": "in"+params.id,
            "pos_id": params.id,
            "reservation_id_customer_id": res_cus,
            "note": "Invoice Note",
            "posts":posts
        }
        console.log(payload);
        await axios.post(`https://app.hotelrunner.com/api/v1/apps/pos/postings?token=${this.token}&hr_id=${this.hr_id}`,payload)
        .then(res => {
            console.log('posted to PMS: ',res);
            return true
        }).catch(err => { 
            console.log('error: ',err);
            return false
        })
    }
}

export default new DevAPI();
