'use strict'
const should    = require('should');
const sinon     = require('sinon');
const r         = require('random-js')();
const _         = require('underscore');

describe('getDailyPollenForecast', ()=> {
    let sandbox = undefined;
    let client = undefined;
    let defaultsStub = undefined; 
    let sendStub = undefined;
    beforeEach((done)=>{
        sandbox = sinon.createSandbox();
        let request = require('request-promise-native');
        sendStub = sandbox.stub().resolves({statusCode:200, body:{}});
        defaultsStub = sandbox.stub(request, 'defaults').returns(sendStub);
        let breezometer   = require('../index.js');
        client = breezometer({ apiKey:'foo' });
        done();
    });
    afterEach((done)=>{
        sandbox.restore();
        done();
    });
    describe('options callback', ()=> {
        it('undefined err', (done)=> {
            client.getDailyPollenForecast(undefined, (err)=> {
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=> {
            client.getDailyPollenForecast(null, (err)=> {
                should.exist(err);
                done();
            });
        });
        it('not obj err', (done)=> {
            client.getDailyPollenForecast(99, (err)=> {
                should.exist(err);
                done();
            });
        });
    });
    describe('options promise', ()=> {
        it('undefined err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast(undefined);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast(null);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('not obj err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast(99);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
    });
    describe('lat callback', ()=>{
        it('undefined err', (done)=>{
            client.getDailyPollenForecast({lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getDailyPollenForecast({lat:null, lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getDailyPollenForecast({lat:'foo', lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -90 err', (done)=>{
            client.getDailyPollenForecast({lat:-91, lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 90 err', (done)=>{
            client.getDailyPollenForecast({lat:91, lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getDailyPollenForecast({lat:'43.067475', lon: -89.392808, days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lat = r.real(-90, 90, true);
            client.getDailyPollenForecast({lat:lat, lon: -89.392808, days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
                done();
            });
        });
    });
    describe('lat promise', ()=>{
        it('undefined err', async ()=>{
            let threw = false;

            try {
                await client.getDailyPollenForecast({lon: -89.392808, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;

            try {
                await client.getDailyPollenForecast({lat:null, lon: -89.392808, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;

            try {
                await client.getDailyPollenForecast({lat:'foo', lon: -89.392808, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -90 err', async ()=>{
            let threw = false;

            try {
                await client.getDailyPollenForecast({lat: -91, lon: -89.392808, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 90 err', async ()=>{
            let threw = false;

            try {
                await client.getDailyPollenForecast({lat: 91, lon: -89.392808, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getDailyPollenForecast({lat: '43.067475', lon: -89.392808, days: 1});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lat = r.real(-90, 90, true);
            await client.getDailyPollenForecast({lat:lat, lon: -89.392808, days: 1});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
        });
    });
    describe('lon callback', ()=>{
        it('undefined err', (done)=>{
            client.getDailyPollenForecast({lat: 43.067475, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getDailyPollenForecast({lat: 43.067475, lon:null, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getDailyPollenForecast({lat: 43.067475, lon:'foo', days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -180 err', (done)=>{
            client.getDailyPollenForecast({lat:-181, lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 180 err', (done)=>{
            client.getDailyPollenForecast({lat:181, lon: -89.392808, days: 1}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: '-89.392808', days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lon = r.real(-90, 90, true);
            client.getDailyPollenForecast({lat:43.067475, lon: lon, days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
                done();
            });
        });
    });
    describe('lon promise', ()=>{
        it('undefined err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat: 43.067475, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat: 43.067475, lon:null, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat: 43.067475, lon:'foo', days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -180 err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat: 43.067475, lon:-181, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 180 err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat: 43.067475, lon:181, days: 1});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getDailyPollenForecast({lat: 43.067475, lon:'-89.392808', days: 1});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lon = r.real(-90, 90, true);
            await client.getDailyPollenForecast({lat: 43.067475, lon:lon, days: 1});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
        });
    });
    describe('days callback', ()=> {
        it('undefined err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: null}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< 1 err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 0}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 3 err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 4}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: '1'}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ days: 1 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let days = r.real(1, 3, true);
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: days}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ days: days }  })).should.equal(true);
                done();
            });
        });
    });
    describe('days promise', ()=>{
        it('undefined err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: null});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< 1 err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 0});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 3 err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 4});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: '3'});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let days = r.real(1, 3, true);
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: days});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ days: days }  })).should.equal(true);
        });
    });
    describe('lang callback', ()=>{
        it('undefined works', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lang = _.sample(['en','fr']);
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, lang:lang}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
                done();
            });
        });
        it('invalid err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, lang:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('lang promise', ()=>{
        it('undefined works', async ()=>{
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let lang = _.sample(['en','fr']);
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, lang:lang});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
        });
        it('invalid err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, lang:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('features callback', ()=>{
        it('undefined works', ()=> {
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
            });
        });
        it('matches', (done)=>{
            let features = [
                'types_information',
                'plants_information'
            ];
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, features:features}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ features: features.join() }  })).should.equal(true);
                done();
            });
        });
        it('not array error', (done)=> {
            client.getDailyPollenForecast({lat: 43.067475, lon: -89.392808, days: 1, features: 'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('empty error', (done)=> {
            client.getDailyPollenForecast({lat: 43.067475, lon: -89.392808, days: 1, features: []}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('invalid feature error', (done)=> {
            client.getDailyPollenForecast({lat: 43.067475, lon: -89.392808, days: 1, features: ['foo']}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('duplicate feature error', (done)=> {
            client.getDailyPollenForecast({lat: 43.067475, lon: -89.392808, days: 1, features: ['breezometer_aqi', 'breezometer_aqi']}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('features promises', ()=>{
        it('undefined works', async ()=>{
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let features = [
                'types_information',
                'plants_information'
            ];
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, features:features});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ features: features.join() }  })).should.equal(true);
        });
        it('not array error', async ()=> {
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, features:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('empty error', async ()=> {
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, features: []});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('invalid feature error', async ()=> {
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, features: ['foo']});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('duplicate feature error', async ()=> {
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, features: ['breezometer_aqi', 'breezometer_aqi']});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('metadata callback', () =>{
        it('undefined works', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let metadata = _.sample([true, false]);
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, metadata:metadata}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ metadata: metadata }  })).should.equal(true);
                done();
            });
        });
        it('not bool err', (done)=>{
            client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, metadata:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('metadata promises', () =>{
        it('undefined works', async ()=>{
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let metadata = _.sample([true, false]);
            await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, metadata:metadata});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ metadata: metadata }  })).should.equal(true);
        });
        it('not bool err', async ()=>{
            let threw = false;
            try {
                await client.getDailyPollenForecast({lat:43.067475, lon: -89.392808, days: 1, metadata:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('key callback', ()=> {
        it('forbidden err', (done)=>{
            client.getDailyPollenForecast({
                lat:43.067475,
                lon: -89.392808,
                days: 1,
                key: 'foo'
            }, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('key promises', ()=> {
        it('forbidden err', async ()=>{
            let threw = false;

            try {
                await client.getDailyPollenForecast({
                    lat:43.067475,
                    lon: -89.392808,
                    days: 1,
                    key: 'foo'
                });
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
    });
});