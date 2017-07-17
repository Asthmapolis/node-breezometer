'use strict'
const should    = require('should');
const sinon     = require('sinon');
const r         = require('random-js')();
const _         = require('underscore');
const moment    = require('moment');

describe('getForecast', ()=>{
    let sandbox = undefined;
    let client = undefined;
    let defaultsStub = undefined; 
    let sendStub = undefined;
    beforeEach((done)=>{
        sandbox = sinon.sandbox.create();
        let request = require('request');
        sendStub = sandbox.stub().yields(null, {statusCode:200}, {});
        defaultsStub = sandbox.stub(request, 'defaults').returns(sendStub);
        let breezometer   = require('../index.js');
        client = breezometer({ apiKey:'foo' });
        done();
    });
    afterEach((done)=>{
        sandbox.restore();
        done();
    });
    describe('options', ()=>{
        it('undefined err', (done)=>{
            client.getForecast(undefined, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getForecast(null, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not obj err', (done)=>{
            client.getForecast(99, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('lat', ()=>{
        it('undefined err', (done)=>{
            client.getForecast({
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getForecast({
                lat:null,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getForecast({
                lat:'foo',
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -90 err', (done)=>{
            client.getForecast({
                lat:-91,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 90 err', (done)=>{
            client.getForecast({
                lat:91,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getForecast({
                lat:'43.067475',
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lat = r.real(-90, 90, true);
            client.getForecast({
                lat:lat,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
                done();
            });
        });
    });
    describe('lon', ()=>{
        it('undefined err', (done)=>{
            client.getForecast({
                lat: 43.067475,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getForecast({
                lat: 43.067475,
                lon:null,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getForecast({
                lat: 43.067475,
                lon:'foo',
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -180 err', (done)=>{
            client.getForecast({
                lat:-181,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 180 err', (done)=>{
            client.getForecast({
                lat:181,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: '-89.392808',
                hours: 8
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lon = r.real(-90, 90, true);
            client.getForecast({
                lat:43.067475,
                lon: lon,
                hours: 8
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
                done();
            });
        });
    });
    describe('hours', ()=>{
        it('not number err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 'foo'
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< 1 err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: -1
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 24 err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 25
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('undefined & range undefined err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('set & range set err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 1,
                startDate: new Date(),
                endDate: new Date(Date.now() + 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let hours = r.integer(1, 24);
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: hours
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ hours: hours }  })).should.equal(true);
                done();
            });
        });
    });
    describe('startDate', ()=>{
        it('past err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() - 60000),
                endDate: new Date(Date.now() + 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not date err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: 'foo',
                endDate: new Date(Date.now() + 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('undefined & endDate set', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                endDate: new Date(Date.now() + 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('set & hours set', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 1,
                startDate: new Date(Date.now() + 60000),
                endDate: new Date(Date.now() + 60001)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let startDate = moment.utc().add(r.integer(60000, 864000000), 'milliseconds').startOf('second').toDate();
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: startDate,
                endDate: new Date(startDate.getTime() + 1)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ start_datetime: startDate }  })).should.equal(true);
                done();
            });
        });
    });
    describe('endDate', ()=>{
        it('past err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() + 60000),
                endDate: new Date(Date.now() - 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not date err', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() + 60000),
                endDate: 'foo'
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('undefined & startDate set', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() + 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('set & hours set', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 1,
                startDate: new Date(Date.now() + 60000),
                endDate: new Date(Date.now() + 60001)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let endDate = moment.utc().add(r.integer(60000, 864000000), 'milliseconds').endOf('second').toDate();
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(endDate.getTime() - 1),
                endDate: endDate
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ end_datetime: endDate }  })).should.equal(true);
                done();
            });
        });
    });
    describe('lang', ()=>{
        it('undefined works', (done)=>{
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 8
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('invalid err', (done)=>{
            client.getForecast({
                lat:43.067475, 
                lon: -89.392808, 
                lang:'foo',
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let lang = _.sample(['en','he']);
            client.getForecast({lat:43.067475, lon: -89.392808, lang:lang, hours: 8}, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
                done();
            });
        });
    });
});