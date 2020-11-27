import firebase from './firebase.js'

const oErrLog = firebase.db.ref('log/error');
const $showUpError = jQuery('#show-error');

function renderLogItem(oItem) {
  return '<li>'+oItem.text+ ' - userID:' +oItem.userID+ '</li>';
}

function getVal(val) {
  const aMsg = Object.values(val).map(oErr => {
    return renderLogItem(oErr);
  });

  return aMsg.join('');
}

oErrLog.once('value', (snap => {
  const val = snap.val();
  if (val !== null) {
    $showUpError.html(getVal(val));
  }
}));

oErrLog.on('child_added', (snap => {
  const val = snap.val();
  if (val !== null) {
    $showUpError.append(renderLogItem(val));
  }
}));

oErrLog.on('child_removed', (snap => {
  const val = snap.val();
  if (val !== null) {
    $showUpError.html('');
  }
}));

const oSuccessLog = firebase.db.ref('log/success');
const $showUpSuccess = jQuery('#show-success');

oSuccessLog.once('value', (snap => {
  const val = snap.val();
  if (val !== null) {
    $showUpSuccess.html(getVal(val));
  }
}));

oSuccessLog.on('child_added', (snap => {
  const val = snap.val();
  if (val !== null) {
    $showUpSuccess.append(renderLogItem(val));
  }
}));

oSuccessLog.on('child_removed', (snap => {
  const val = snap.val();
  if (val !== null) {
    $showUpSuccess.html('');
  }
}));
