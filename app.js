(() => {
const button = document.getElementById('install-app');
let pending;
window.addEventListener('beforeinstallprompt', event => {
 event.preventDefault(); pending = event; button.hidden = false;
});
button.addEventListener('click', async () => {
 if (!pending) return;
 await pending.prompt(); await pending.userChoice; pending = null; button.hidden = true;
});
window.addEventListener('appinstalled', () => {button.hidden = true; document.getElementById('install-help').textContent = 'Aplicativo instalado.';});
const status = document.getElementById('offline-status');
function connection() {status.textContent = navigator.onLine ? '' : 'Você está sem internet. Vídeos e páginas externas estarão disponíveis quando a conexão voltar.';}
window.addEventListener('online', connection); window.addEventListener('offline', connection); connection();
if ('serviceWorker' in navigator) window.addEventListener('load', () => {
 navigator.serviceWorker.register('./sw.js').catch(() => {status.textContent = 'O acesso sem internet ainda não está disponível neste navegador.';});
});
})();
