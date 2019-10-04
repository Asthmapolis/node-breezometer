'use strict'
const should    = require('should');
const sinon     = require('sinon');
const r         = require('random-js')();
const _         = require('underscore');

describe('getCurrentFireConditions', ()=> {
    let sandbox = undefined;
    let client = undefined;
    let defaultsStub = undefined; 
    let sendStub = undefined;
    beforeEach((done)=>{
        sandbox = sinon.createSandbox();
        let request = require('request-promise-native');
        sendStub = sandbox.stub().resolves({statusCode:200, body:{}});
        defaultsStub = sandbox.stub(request, 'defaults').returns(sendStub);
        let breezometer   = require('../lib/index.js');
        client = breezometer({ apiKey:'foo' });
        done();
    });
    afterEach((done)=>{
        sandbox.restore();
        done();
    });
    describe('options callback', ()=> {
        it('undefined err', (done)=> {
            client.getCurrentFireConditions(undefined, (err)=> {
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=> {
            client.getCurrentFireConditions(null, (err)=> {
                should.exist(err);
                done();
            });
        });
        it('not obj err', (done)=> {
            client.getCurrentFireConditions(99, (err)=> {
                should.exist(err);
                done();
            });
        });
    });
    describe('options promise', ()=> {
        it('undefined err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions(undefined);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions(null);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
        it('not obj err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions(99);
            } catch (err){
                threw = true;
            }
            threw.should.equal(true);
        });
    });
    describe('lat callback', ()=>{
        it('undefined err', (done)=>{
            client.getCurrentFireConditions({lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getCurrentFireConditions({lat:null, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getCurrentFireConditions({lat:'foo', lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -90 err', (done)=>{
            client.getCurrentFireConditions({lat:-91, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 90 err', (done)=>{
            client.getCurrentFireConditions({lat:91, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getCurrentFireConditions({lat:'43.067475', lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lat = r.real(-90, 90, true);
            client.getCurrentFireConditions({lat:lat, lon: -89.392808}, (err)=>{
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
                await client.getCurrentFireConditions({lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;

            try {
                await client.getCurrentFireConditions({lat:null, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;

            try {
                await client.getCurrentFireConditions({lat:'foo', lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -90 err', async ()=>{
            let threw = false;

            try {
                await client.getCurrentFireConditions({lat: -91, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 90 err', async ()=>{
            let threw = false;

            try {
                await client.getCurrentFireConditions({lat: 91, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getCurrentFireConditions({lat: '43.067475', lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lat = r.real(-90, 90, true);
            await client.getCurrentFireConditions({lat:lat, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
        });
    });
    describe('lon callback', ()=>{
        it('undefined err', (done)=>{
            client.getCurrentFireConditions({lat: 43.067475}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getCurrentFireConditions({lat: 43.067475, lon:null}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getCurrentFireConditions({lat: 43.067475, lon:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -180 err', (done)=>{
            client.getCurrentFireConditions({lat:-181, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 180 err', (done)=>{
            client.getCurrentFireConditions({lat:181, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: '-89.392808'}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lon = r.real(-90, 90, true);
            client.getCurrentFireConditions({lat:43.067475, lon: lon}, (err)=>{
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
                await client.getCurrentFireConditions({lat: 43.067475});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat: 43.067475, lon:null});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat: 43.067475, lon:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -180 err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat: 43.067475, lon:-181});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 180 err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat: 43.067475, lon:181});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getCurrentFireConditions({lat: 43.067475, lon:'-89.392808'});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lon = r.real(-90, 90, true);
            await client.getCurrentFireConditions({lat: 43.067475, lon:lon});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
        });
    });
    describe('radius callback', ()=> {
        it('undefined works', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let rad = r.integer(1, 100, true);
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius:rad}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ radius: rad }  })).should.equal(true);
                done();
            });
        });
        it('invalid type err', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< 1 err', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius:0}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 62 as imperial', (done)=>{
            let rad = r.integer(63, 100, true);
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius:rad, units: 'imperial'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('radius promise', ()=>{
        it('undefined works', async ()=>{
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808, lat: 43.067475}  })).should.equal(true);
        });
        it('matches', async ()=>{
            let rad = r.integer(1, 100, true);
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius:rad});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ radius: rad }  })).should.equal(true);
        });
        it('invalid type err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius: 'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< 1 err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius: 0});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 62 as imperial err', async ()=>{
            let threw = false;
            let rad = r.integer(63, 100, true);
            try {
                await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, radius: rad, units: 'imperial'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('units callback', ()=>{
        it('undefined works', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let units = _.sample(['imperial', 'metric']);
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, units:units}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ units: units }  })).should.equal(true);
                done();
            });
        });
        it('invalid err', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, units:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('units promises', ()=>{
        it('undefined works', async ()=>{
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let units = _.sample(['imperial', 'metric']);
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, units:units});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ units: units }  })).should.equal(true);
        });
        it('invalid err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, units:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('lang callback', ()=>{
        it('undefined works', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lang = _.sample(['en']);
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, lang:lang}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
                done();
            });
        });
        it('invalid err', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, lang:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('lang promise', ()=>{
        it('undefined works', async ()=>{
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let lang = _.sample(['en']);
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, lang:lang});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
        });
        it('invalid err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, lang:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('metadata callback', () =>{
        it('undefined works', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let metadata = _.sample([true, false]);
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, metadata:metadata}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ metadata: metadata }  })).should.equal(true);
                done();
            });
        });
        it('not bool err', (done)=>{
            client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, metadata:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('metadata promises', () =>{
        it('undefined works', async ()=>{
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let metadata = _.sample([true, false]);
            await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, metadata:metadata});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ metadata: metadata }  })).should.equal(true);
        });
        it('not bool err', async ()=>{
            let threw = false;
            try {
                await client.getCurrentFireConditions({lat:43.067475, lon: -89.392808, metadata:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
    describe('key callback', ()=> {
        it('forbidden err', (done)=>{
            client.getCurrentFireConditions({
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
                await client.getCurrentFireConditions({
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