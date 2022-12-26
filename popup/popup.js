'use strict';

const url = document.getElementById('url');
const times = document.getElementById('times');
const button = document.getElementById('submit');

chrome.storage.local.get(['url', 'times'], items => {
  url.value = items.url;
  times.value = items.times;
});

button.addEventListener('click', () => {
  if (!url.value || !times.value) {
    return alert('未入力の項目があります');
  } else if (!/^(https?:\/\/)(www\.|mobile\.)?twitter\.com/.test(url.value)) {
    return alert('水増ししたいツイートのURLを入力してください');
  } else if (times.value > 10000) {
    return alert('水増し回数の上限は10000回です');
  }

  if (!confirm(
    `以下の内容で水増しを行います。よろしければ "OK" を押してください

    ツイートURL：${url.value}
    水増し回数：${times.value}回
    所要時間：${times.value * 3}秒

    水増し中に開かれたTwitterのタブは閉じないでください。
    また、別タブを開くと表示回数がカウントされない場合がございます。 (システムに影響はありません)
    どうしても別タブを開きたい場合は新規ウィンドウを立ち上げてください。
    タブは終了後に自動で閉じます。`
  )) {
    return;
  }

  const data = {
    url: url.value,
    times: times.value
  }

  chrome.runtime.sendMessage(data);
  chrome.storage.local.set(data);
});