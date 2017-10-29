const express = require('express');
const router = express.Router();
const request = require('request');

/**
 * say cheese.
 */
router.post('/say-cheese', function(req, res, next) {
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  res.header('Access-Control-Allow-Origin','*');

  const gatherParams = {
    input: 'dtmf',
    numDigits: 1,
    language: 'ja-JP',
    timeout: 5,
  };

  if (!req.body.Digits) {
    twiml.gather(gatherParams)
      .play({}, 'https://fast-person-9223.twil.io/assets/explain.wav');
    res.send(twiml.toString());
    res.end();
  } else {

    // ここでライトを光らせる
    //got('todomvc.com').then(response => {
    //  console.log(response.body);
    //}).catch(err => {
    //  console.log(err.response.body);
    //});

    twiml.play({}, 'https://fast-person-9223.twil.io/assets/321.wav');

    twiml.redirect({method: 'POST'}, 'https://1c881f95.ngrok.io/api/shot?Digits=' + req.body.Digits);
    res.send(twiml.toString());
    res.end();
  }
});

/**
 * shot
 */
router.post('/shot', function(req, res, next) {
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  request({
    url: 'http://192.168.11.203/command.cgi?op=190&CTRL=0x1e&DATA=0x2'
  }, err => {
    twiml.play({}, 'https://fast-person-9223.twil.io/assets/Camera-Shutter03-1.mp3');
    if (req.query.Digits == '1') {
      twiml.sms({
        to: req.body.From,
        from: '+13234190276',
      }, '名古屋城からの写真はこちら！\nhttps://nagoyahackathon.blob.core.windows.net/wakuwaku/normal.jpg');
      twiml.play({}, 'https://fast-person-9223.twil.io/assets/send-normal.wav');
      res.send(twiml.toString());
      res.end();

    } else if (req.query.Digits == '2') {
      twiml.sms({
        to: req.body.From,
        from: '+13234190276',
      }, '名古屋城からのAR写真はこちら！\nhttps://nagoyahackathon.blob.core.windows.net/wakuwaku/AR.jpg');
      twiml.play({}, 'https://fast-person-9223.twil.io/assets/send-ar.wav');
      res.send(twiml.toString());
      res.end();

    } else {
      res.send('err');
      res.end();
    }

    setTimeout(() => {
      request({
        url: 'http://192.168.11.203/command.cgi?op=190&CTRL=0x1e&DATA=0x0'
      });
    }, 1000);
  });
});

module.exports = router;
