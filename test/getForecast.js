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
        sandbox = sinon.createSandbox();
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
    describe('options callback', ()=>{
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
    describe('options promise', ()=>{
        it('undefined err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast(undefined);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast(null);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('not obj err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast(99);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
    });
    describe('lat callback', ()=>{
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
    describe('lat promise', ()=>{
        it('undefined err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast({
                    lon: -89.392808,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast({
                    lat: null,
                    lon: -89.392808,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast({
                    lat: 'foo',
                    lon: -89.392808,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('< -90 err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast({
                    lat: -91,
                    lon: -89.392808,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('> 90 err', async ()=>{
            let threw = false;
            
            try {
                await client.getForecast({
                    lat: 91,
                    lon: -89.392808,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getForecast({
                lat: '43.067475',
                lon: -89.392808,
                hours: 8
            });
            sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lat = r.real(-90, 90, true);
            await client.getForecast({
                lat: lat,
                lon: -89.392808,
                hours: 8
            });
            sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
        });
    });
    describe('lon callback', ()=>{
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
                lat: 43.067475,
                lon: -181,
                hours: 8
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 180 err', (done)=>{
            client.getForecast({
                lat: 43.067475,
                lon: 181,
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
    describe('lon promises', ()=>{
        it('undefined err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat: 43.067475,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat: 43.067475,
                    lon: null,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat: 43.067475,
                    lon: 'foo',
                    hours: 8
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -180 err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat: 43.067475,
                    lon: -181,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 180 err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat: 43.067475,
                    lon: 181,
                    hours: 8
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getForecast({
                lat: 43.067475,
                lon: '-89.392808',
                hours: 8
            });
            sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lon = r.real(-90, 90, true);
            await client.getForecast({
                lat: 43.067475,
                lon: lon,
                hours: 8
            });
            sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
        });
    });
    describe('hours callback', ()=>{
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
    describe('hours promises', ()=>{
        it('not number err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    hours: 'foo'
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< 1 err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    hours: -1
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 24 err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    hours: 25
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('undefined & range undefined err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('set & range set err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    hours: 1,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 60000)
                });
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('matches', async ()=>{
            let hours = r.integer(1, 24);
            await client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: hours
            });
            sendStub.calledWith(sinon.match({ qs:{ hours: hours }  })).should.equal(true);
        });
    });
    describe('startDate callback', ()=>{
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
            let startDate = moment.utc().add(r.integer(60000, 864000000), 'milliseconds').startOf('minute').toDate();
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: startDate,
                endDate: new Date(startDate.getTime() + 1)
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ start_datetime: moment.utc(startDate).format("YYYY-MM-DDTHH:mm:ss") }  })).should.equal(true);
                done();
            });
        });
    });
    describe('startDate promises', ()=>{
        it('past err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    startDate: new Date(Date.now() - 60000),
                    endDate: new Date(Date.now() + 60000)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('not date err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    startDate: 'foo',
                    endDate: new Date(Date.now() + 60000)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('undefined & endDate set', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    endDate: new Date(Date.now() + 60000)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('set & hours set', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    hours: 1,
                    startDate: new Date(Date.now() + 60000),
                    endDate: new Date(Date.now() + 60001)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('matches', async ()=>{
            let startDate = moment.utc().add(r.integer(60000, 864000000), 'milliseconds').startOf('minute').toDate();
            await client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: startDate,
                endDate: new Date(startDate.getTime() + 1)
            });
            sendStub.calledWith(sinon.match({ qs:{ start_datetime: moment.utc(startDate).format("YYYY-MM-DDTHH:mm:ss") }  })).should.equal(true);
        });
    });
    describe('endDate callback', ()=>{
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
            let endDate = moment.utc().add(r.integer(60000, 864000000), 'milliseconds').endOf('minute').toDate();
            client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(endDate.getTime() - 1),
                endDate: endDate
            }, (err)=>{
                should.not.exist(err);
                sendStub.calledWith(sinon.match({ qs:{ end_datetime: moment.utc(endDate).format("YYYY-MM-DDTHH:mm:ss") }  })).should.equal(true);
                done();
            });
        });
    });
    describe('endDate promises', ()=>{
        it('past err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    startDate: new Date(Date.now() + 60000),
                    endDate: new Date(Date.now() - 60000)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('not date err', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    startDate: new Date(Date.now() + 60000),
                    endDate: 'foo'
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('undefined & startDate set', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    startDate: new Date(Date.now() + 60000)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('set & hours set', async ()=>{
            let threw = false;

            try {
                await client.getForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    hours: 1,
                    startDate: new Date(Date.now() + 60000),
                    endDate: new Date(Date.now() + 60001)
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('matches', async ()=>{
            let endDate = moment.utc().add(r.integer(60000, 864000000), 'milliseconds').endOf('minute').toDate();
            await client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                startDate: new Date(endDate.getTime() - 1),
                endDate: endDate
            });
            sendStub.calledWith(sinon.match({ qs:{ end_datetime: moment.utc(endDate).format("YYYY-MM-DDTHH:mm:ss") }  })).should.equal(true);
        });
    });
    describe('lang callback', ()=>{
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
    describe('lang promises', ()=>{
        it('undefined works', async ()=>{
            await client.getForecast({
                lat:43.067475,
                lon: -89.392808,
                hours: 8
            });
            sendStub.calledOnce.should.equal(true);
        });
        it('invalid err', async ()=>{
            let threw = false;
            try {
                await client.getForecast({
                    lat:43.067475, 
                    lon: -89.392808, 
                    lang:'foo',
                    hours: 8
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('matches', async ()=>{
            let lang = _.sample(['en','he']);
            await client.getForecast({lat:43.067475, lon: -89.392808, lang:lang, hours: 8});
            sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
        });
    });
});