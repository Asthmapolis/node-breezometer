'use strict'
const should    = require('should');
const sinon     = require('sinon');
const r         = require('random-js')();
const _         = require('underscore');

describe('getAirQuality', ()=>{
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
            client.getAirQuality(undefined, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getAirQuality(null, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not obj err', (done)=>{
            client.getAirQuality(99, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('options promise', ()=>{
        it('undefined err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality(undefined);
            } catch (err){
                threw = true;
            }
            
            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality(null);
            } catch (err){
                threw = true;
            }
            
            threw.should.equal(true);
        });
        it('not obj err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality(99);
            } catch (err){
                threw = true;
            }
            
            threw.should.equal(true);
        });
    });
    describe('lat callback', ()=>{
        it('undefined err', (done)=>{
            client.getAirQuality({lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getAirQuality({lat:null, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getAirQuality({lat:'foo', lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -90 err', (done)=>{
            client.getAirQuality({lat:-91, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 90 err', (done)=>{
            client.getAirQuality({lat:91, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getAirQuality({lat:'43.067475', lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lat = r.real(-90, 90, true);
            client.getAirQuality({lat:lat, lon: -89.392808}, (err)=>{
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
                await client.getAirQuality({lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;

            try {
                await client.getAirQuality({lat: null, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;

            try {
                await client.getAirQuality({lat: 'foo', lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -90 err', async ()=>{
            let threw = false;

            try {
                await client.getAirQuality({lat: -91, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 90 err', async ()=>{
            let threw = false;

            try {
                await client.getAirQuality({lat: 91, lon: -89.392808});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getAirQuality({lat: '43.067475', lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lat: 43.067475 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lat = r.real(-90, 90, true);
            await client.getAirQuality({lat:lat, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lat: lat }  })).should.equal(true);
        });
    });
    describe('lon callback', ()=>{
        it('undefined err', (done)=>{
            client.getAirQuality({lat: 43.067475}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('null err', (done)=>{
            client.getAirQuality({lat: 43.067475, lon:null}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('not number err', (done)=>{
            client.getAirQuality({lat: 43.067475, lon:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('< -180 err', (done)=>{
            client.getAirQuality({lat:-181, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('> 180 err', (done)=>{
            client.getAirQuality({lat:181, lon: -89.392808}, (err)=>{
                should.exist(err);
                done();
            });
        });
        it('string number', (done)=>{
            client.getAirQuality({lat:43.067475, lon: '-89.392808'}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lon = r.real(-90, 90, true);
            client.getAirQuality({lat:43.067475, lon: lon}, (err)=>{
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
                await client.getAirQuality({lat: 43.067475});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('null err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality({lat: 43.067475, lon:null});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('not number err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality({lat: 43.067475, lon:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('< -180 err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality({lat: 43.067475, lon:-181});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('> 180 err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality({lat: 43.067475, lon:181});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
        it('string number', async ()=>{
            await client.getAirQuality({lat: 43.067475, lon:'-89.392808'});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: -89.392808 }  })).should.equal(true);
        });
        it('matches', async ()=>{
            let lon = r.real(-90, 90, true);
            await client.getAirQuality({lat: 43.067475, lon:lon});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lon: lon }  })).should.equal(true);
        });
    });
    describe('lang callback', ()=>{
        it('undefined works', (done)=>{
            client.getAirQuality({lat:43.067475, lon: -89.392808}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                done();
            });
        });
        it('matches', (done)=>{
            let lang = _.sample(['en','he']);
            client.getAirQuality({lat:43.067475, lon: -89.392808, lang:lang}, (err)=>{
                should.not.exist(err);
                sendStub.calledOnce.should.equal(true);
                sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
                done();
            });
        });
        it('invalid err', (done)=>{
            client.getAirQuality({lat:43.067475, lon: -89.392808, lang:'foo'}, (err)=>{
                should.exist(err);
                done();
            });
        });
    });
    describe('lang promise', ()=>{
        it('undefined works', async ()=>{
            await client.getAirQuality({lat:43.067475, lon: -89.392808});
            sendStub.calledOnce.should.equal(true);
        });
        it('matches', async ()=>{
            let lang = _.sample(['en','he']);
            await client.getAirQuality({lat:43.067475, lon: -89.392808, lang:lang});
            sendStub.calledOnce.should.equal(true);
            sendStub.calledWith(sinon.match({ qs:{ lang: lang }  })).should.equal(true);
        });
        it('invalid err', async ()=>{
            let threw = false;
            try {
                await client.getAirQuality({lat:43.067475, lon: -89.392808, lang:'foo'});
            } catch (err){
                threw = true;
            }

            threw.should.equal(true);
        });
    });
});