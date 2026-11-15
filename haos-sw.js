// HAOS Web Push service worker; intentionally no fetch/cache handlers.
self.addEventListener('push', event => {
  let message={title:'ХАОС',body:'Есть важное напоминание',kind:'custom'};
  try{if(event.data){const x=event.data.json();if(x&&['task','event','custom'].includes(x.kind)){message.kind=x.kind;message.body=x.kind==='task'?'Пора вспомнить о важной задаче':x.kind==='event'?'Скоро запланированное событие':'У тебя запланировано напоминание';}}}catch{}
  event.waitUntil(self.registration.showNotification('ХАОС', {
    body:message.body,icon:'./haos-icon-192.png',badge:'./haos-icon-192.png',tag:'haos-reminder-'+message.kind+'-'+Date.now(),
    data:{url:'./'},silent:false,renotify:false
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients => {
    const target=new URL('./',self.registration.scope).href;
    for(const client of clients){if(client.url.startsWith(target) && 'focus' in client)return client.focus()}
    return self.clients.openWindow?self.clients.openWindow(target):null;
  }));
});
