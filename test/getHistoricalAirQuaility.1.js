'use strict'
const should    = require('should');
const sinon     = require('sinon');
const r         = require('random-js')();
const _         = require('underscore');

describe('getHistoricalAirQuaility', ()=>{
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
            client.getHistoricalAirQuaility(undefined, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getHistoricalAirQuaility(null, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not obj err', (done)=>{
            client.getHistoricalAirQuaility(99, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('lat', ()=>{
        it('undefined err', (done)=>{
            client.getHistoricalAirQuaility({
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:null,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:'foo',
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -90 err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:-91,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 90 err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:91,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getHistoricalAirQuaility({
                lat:'43.067475',
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lat = r.real(-90, 90, true);
            client.getHistoricalAirQuaility({
                lat:lat,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
                done();
            });
        });
    });
    describe('lon', ()=>{
        it('undefined err', (done)=>{
            client.getHistoricalAirQuaility({
                lat: 43.067475,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getHistoricalAirQuaility({
                lat: 43.067475,
                lon:null,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getHistoricalAirQuaility({
                lat: 43.067475,
                lon:'foo',
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -180 err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:-181,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 180 err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:181,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: '-89.392808',
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lon = r.real(-90, 90, true);
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: lon,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
                done();
            });
        });
    });
    describe('dateTime', ()=>{
        it('future err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: new Date(Date.now() + 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not date err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: 'foo'
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('undefined & range undefined err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('set & ranges set err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: new Date(Date.now() + 864000000),
                startDate: new Date(Date.now() + 864000000),
                endDate: new Date(Date.now() + 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let dateTime = new Date(Date.now() - r.integer(60000, 864000000));
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: dateTime
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ datetime: dateTime }  })).should.equal(true);
                done();
            });
        });
    });
    describe('startDate', ()=>{
        it('future err', (done)=>{
            client.getHistoricalAirQuaility({
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
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                startDate: 'foo',
                endDate: new Date(Date.now() - 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('undefined & endDate set', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                endDate: new Date(Date.now() - 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('set & dateTime set', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 120000),
                startDate: new Date(Date.now() - 120000),
                endDate: new Date(Date.now() - 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let startDate = new Date(Date.now() - r.integer(60000, 864000000));
            client.getHistoricalAirQuaility({
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
        it('future err', (done)=>{
            client.getHistoricalAirQuaility({
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
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() - 60000),
                endDate: 'foo'
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('undefined & startDate set', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() - 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('set & dateTime set', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 120000),
                startDate: new Date(Date.now() - 120000),
                endDate: new Date(Date.now() - 60000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let endDate = new Date(Date.now() - r.integer(60000, 864000000));
            client.getHistoricalAirQuaility({
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
    describe('interval', ()=>{
        it('not a number err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() - 60000),
                endDate: new Date(Date.now() - 60000),
                interval: 'foo'
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('included w/o range err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 60000),
                interval: 1
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let interval = r.integer(1, 24);
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(Date.now() - 60000),
                endDate: new Date(Date.now() - 60000),
                interval: interval
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ interval: interval }  })).should.equal(true);
                done();
            });
        });
    });
    describe('lang', ()=>{
        it('undefined works', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475,
                lon: -89.392808,
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('invalid err', (done)=>{
            client.getHistoricalAirQuaility({
                lat:43.067475, 
                lon: -89.392808, 
                lang:'foo',
                dateTime: new Date(Date.now() - 864000000)
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('matches', (done)=>{
            let lang = _.sample(['en','he']);
            client.getHistoricalAirQuaility({lat:43.067475, lon: -89.392808, lang:lang, dateTime: new Date(Date.now() - 864000000)}, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
                done();
            });
        });
    });
});