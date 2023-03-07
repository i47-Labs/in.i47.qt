const quote = {
    name: "Quote",
    data() {
        return {
            config: {type: 'US', protocol: 'M', power: 'W', size: '20', display: 'M'},
            offer: {quantity:0,discount:30,duration:7,initial:2700},
            selected: []
        }
    },
    created() {},
    computed: {
        listed(){
            let price=this.config.type=='US'?9900:7900;
            price+=this.config.protocol=='M'?0:600;
            price+=this.config.power=='W'?0:800;
            price+=this.config.size=='20'?0:this.config.size=='25'?900:1800;
            price+=this.config.display=='M'?0:300;
            return price;
        },
        offered(){
            return this.listed*(100-this.offer.discount)/100;
        },
        moq() {
            return this.offer.quantity>800 ?
            {buy:this.listed*.5*.84,rent:1800,amc:.06} :
            this.offer.quantity>300 ?
            {buy:this.listed*.5,rent:2100,amc:.08} :
            {buy:this.listed*.5*1.16,rent:2300,amc:.09};
        },
        amc() {
            let perc = this.offer.quantity>800 ? .06 : this.offer.quantity>300 ? .08 : .09;
            return Math.round(perc * this.offered);
        },
        emi(){
            let p = this.offered-(isNaN(this.offer.initial)?0:this.offer.initial);
            return this.PMT(0.16/12,this.offer.duration*12,-p);
        },
        tcor(){
            return this.emi*this.offer.duration*12+ (isNaN(this.offer.initial)?0:this.offer.initial);
        },
        grandtotal() {
            let gt=0, gi=0, gp=0;
            this.selected.forEach(s => { gt += s.q*s.lp*(1-s.d/100); gi += s.oi*s.q; gp += s.pi*s.q; });
            return {t:gt,i:gi,p:gp};
        },
        subscription(){
            return this.offered-this.moq.buy > 500 ?0:10;
        },
        model(){
            let c = this.config;
            return c.type + c.size + '-' + c.protocol + c.power + '/' + c.display
        },
        incentive() {return 200+(this.offered-this.moq.buy)*.5},
        modelname(){
            let c = this.config;
            return (c.type == "US"?"Ultrasonic ":"Pulse Based ") + c.size + 'mm -' + (c.protocol=='M'?" Wired":" Wireless") + (c.power=="W"?" without Battery":" with Battery") + ' /' + (c.display=="M"?" IoT":" with Display")
        },
        type() { return [{k:'US',v:'Ultrasonic'},{k:'FS',v:'Pulse Count'}] },
        protocol() { return [{k:'M',v:'Modbus'},{k:'L',v:'LoRa'},{k:'R',v:'RF Mesh'}] },
        power() { return [{k:'W',v:'Wired'},{k:'B',v:'Battery'}] },
        size() { return [{k:'20',v:'20mm'},{k:'25',v:'25mm'},{k:'32',v:'32mm'}] },
        display() { return [{k:'M',v:'Mobile Only'},{k:'D',v:'On-Device'}] },
    },
    methods: {
        addlineitem() {
            if(this.offer.quantity==0) {
                alert('Please select quantity before adding.'); return;
            }
            var dupe = this.selected.filter(s => s.m==this.model)[0];
            if(dupe==undefined) {
                this.selected.push({ m:this.model, n:this.modelname, q:this.offer.quantity, lp:this.listed, d:this.offer.discount, li:this.moq.rent+500, oi:this.offer.initial, e:this.emi, pi:this.incentive });
            } else {
                dupe.q = this.offer.quantity;
                dupe.d = this.offer.discount;
                dupe.li = this.moq.rent+500;
                dupe.oi = this.offer.initial;
                dupe.e = this.emi;
            }
        },
        PMT(ir, np, pv, fv, type) {
            /*
             * ir   - interest rate per month
             * np   - number of periods (months)
             * pv   - present value
             * fv   - future value
             * type - when the payments are due:
             *        0: end of the period, e.g. end of month (default)
             *        1: beginning of period
             */
            var pmt, pvif;
        
            fv || (fv = 0);
            type || (type = 0);
        
            if (ir === 0)
                return -(pv + fv)/np;
        
            pvif = Math.pow(1 + ir, np);
            pmt = - ir * (pv * pvif + fv) / (pvif - 1);
        
            if (type === 1)
                pmt /= (1 + ir);
        
            return Math.round(pmt);
        }        
    },
};
