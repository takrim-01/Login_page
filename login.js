/* ─── AERA — Auth Page JavaScript (Firebase) ─── */

/* ════════════════════════════════════════
   TAB SWITCHING
════════════════════════════════════════ */
function showLogin() {
  document.getElementById('tabLogin').classList.add('active');
  document.getElementById('tabSignup').classList.remove('active');
  document.getElementById('tabIndicator').classList.remove('right');
  const lf = document.getElementById('loginForm');
  const sf = document.getElementById('signupForm');
  sf.classList.remove('active');
  lf.classList.add('active');
  document.getElementById('tagline').textContent = 'Welcome back. The sky awaits.';
}

function showSignup() {
  document.getElementById('tabSignup').classList.add('active');
  document.getElementById('tabLogin').classList.remove('active');
  document.getElementById('tabIndicator').classList.add('right');
  const lf = document.getElementById('loginForm');
  const sf = document.getElementById('signupForm');
  lf.classList.remove('active');
  sf.classList.add('active');
  document.getElementById('tagline').textContent = 'Join Aera. Your journey starts here.';
}


/* ════════════════════════════════════════
   PASSWORD VISIBILITY TOGGLE
════════════════════════════════════════ */
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden
    ? `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`
    : `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
}


/* ════════════════════════════════════════
   PASSWORD STRENGTH METER
════════════════════════════════════════ */
function checkStrength(val) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (val.length >= 14)          score++;
  const levels = [
    { w: '0%',   color: '#d4b896', text: '' },
    { w: '25%',  color: '#e8997a', text: 'Weak' },
    { w: '50%',  color: '#e8c97a', text: 'Fair' },
    { w: '75%',  color: '#a3c47a', text: 'Good' },
    { w: '100%', color: '#6ea85f', text: 'Strong' },
  ];
  const lvl = levels[Math.min(score, 4)];
  fill.style.width      = lvl.w;
  fill.style.background = lvl.color;
  label.textContent     = lvl.text;
  label.style.color     = lvl.color;
}


/* ════════════════════════════════════════
   FORM VALIDATION HELPERS
════════════════════════════════════════ */
function showError(inputId, msg) {
  const input = document.getElementById(inputId);
  const wrap  = input.closest('.input-wrap');
  clearError(inputId);
  input.style.borderColor = '#e8997a';
  input.style.boxShadow   = '0 0 0 3px rgba(232,153,122,0.15)';
  const err = document.createElement('span');
  err.className   = 'err-msg';
  err.textContent = msg;
  err.style.cssText = 'font-size:0.68rem;color:#c0604a;margin-top:0.25rem;letter-spacing:0.03em;';
  wrap.closest('.field').appendChild(err);
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  input.style.borderColor = '';
  input.style.boxShadow   = '';
  const field = input.closest('.field');
  const err   = field.querySelector('.err-msg');
  if (err) err.remove();
}

function clearAllErrors() {
  document.querySelectorAll('.err-msg').forEach(e => e.remove());
  document.querySelectorAll('.input-wrap input').forEach(i => {
    i.style.borderColor = '';
    i.style.boxShadow   = '';
  });
}

/* Firebase error code → friendly message */
function friendlyError(code) {
  const map = {
    'auth/invalid-credential':       'Incorrect email or password.',
    'auth/user-not-found':           'No account found with this email.',
    'auth/wrong-password':           'Incorrect password. Try again.',
    'auth/email-already-in-use':     'This email is already registered.',
    'auth/weak-password':            'Password must be at least 6 characters.',
    'auth/invalid-email':            'Please enter a valid email address.',
    'auth/too-many-requests':        'Too many attempts. Please wait a moment.',
    'auth/network-request-failed':   'Network error. Check your connection.',
    'auth/user-disabled':            'This account has been disabled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}


/* ════════════════════════════════════════
   LOGIN HANDLER — Firebase
════════════════════════════════════════ */
async function handleLogin(e) {
  e.preventDefault();
  clearAllErrors();

  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;

  let valid = true;
  if (!email) { showError('loginEmail',    'Please enter your email.'); valid = false; }
  if (!pass)  { showError('loginPassword', 'Please enter your password.'); valid = false; }
  if (!valid) return;

  const btn = e.target.querySelector('.btn-primary');
  setLoading(btn, true);

  try {
    const result = await window.fbSignIn(window.firebaseAuth, email, pass);
    const user   = result.user;
    setLoading(btn, false);
    showSuccess(
      `Welcome back${user.displayName ? ', ' + user.displayName.split(' ')[0] : ''}.`,
      'You\'ve signed in successfully. Your next flight awaits.'
    );
  } catch (err) {
    setLoading(btn, false);
    showError('loginEmail', friendlyError(err.code));
  }
}


/* ════════════════════════════════════════
   SIGNUP HANDLER — Firebase
════════════════════════════════════════ */
async function handleSignup(e) {
  e.preventDefault();
  clearAllErrors();

  const first    = document.getElementById('signupFirst').value.trim();
  const last     = document.getElementById('signupLast').value.trim();
  const username = document.getElementById('signupUsername').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const pass     = document.getElementById('signupPass').value;
  const confirm  = document.getElementById('signupConfirm').value;
  const agreed   = document.getElementById('agreeTerms').checked;

  let valid = true;
  if (!first)    { showError('signupFirst',    'Required.'); valid = false; }
  if (!last)     { showError('signupLast',     'Required.'); valid = false; }
  if (!username) { showError('signupUsername', 'Choose a username.'); valid = false; }
  else if (username.length < 3) { showError('signupUsername', 'At least 3 characters.'); valid = false; }

  if (!email) { showError('signupEmail', 'Enter your email address.'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('signupEmail', 'That doesn\'t look like a valid email.'); valid = false;
  }

  if (!pass)          { showError('signupPass', 'Create a password.'); valid = false; }
  else if (pass.length < 8) { showError('signupPass', 'At least 8 characters required.'); valid = false; }

  if (pass && confirm !== pass) { showError('signupConfirm', 'Passwords do not match.'); valid = false; }

  if (!agreed) {
    const terms = document.querySelector('.terms-check');
    terms.style.color = '#c0604a';
    setTimeout(() => terms.style.color = '', 2000);
    valid = false;
  }

  if (!valid) return;

  const btn = e.target.querySelector('.btn-primary');
  setLoading(btn, true);

  try {
    // Create account
    const result = await window.fbSignUp(window.firebaseAuth, email, pass);

    // Save display name
    await window.fbUpdateProfile(result.user, {
      displayName: `${first} ${last}`
    });

    setLoading(btn, false);
    showSuccess(
      `Welcome, ${first}.`,
      'Your Aera account is ready. Time to explore the world.'
    );
  } catch (err) {
    setLoading(btn, false);
    if (err.code === 'auth/email-already-in-use') {
      showError('signupEmail', friendlyError(err.code));
    } else {
      showError('signupFirst', friendlyError(err.code));
    }
  }
}


/* ════════════════════════════════════════
   LOADING STATE
════════════════════════════════════════ */
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = `<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
    </svg>`;
    btn.disabled      = true;
    btn.style.opacity = '0.85';
  } else {
    btn.innerHTML     = btn.dataset.original || btn.innerHTML;
    btn.disabled      = false;
    btn.style.opacity = '';
  }
}

const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.7s linear infinite; }';
document.head.appendChild(spinStyle);


/* ════════════════════════════════════════
   SUCCESS OVERLAY
════════════════════════════════════════ */
function showSuccess(title, msg) {
  document.getElementById('successTitle').textContent = title;
  document.getElementById('successMsg').textContent   = msg;
  document.getElementById('successOverlay').classList.add('active');
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('active');
  clearAllErrors();
  showLogin();
  document.getElementById('loginForm').reset();
  document.getElementById('signupForm').reset();
  document.getElementById('strengthFill').style.width = '0%';
  document.getElementById('strengthLabel').textContent = '';
}


/* ════════════════════════════════════════
   LOGO DRAG & DROP / CLICK TO UPLOAD
════════════════════════════════════════ */
const logoWrap = document.getElementById('logoWrap');

logoWrap.addEventListener('dragover', e => {
  e.preventDefault();
  logoWrap.style.borderColor = '#c4a35a';
  logoWrap.style.boxShadow   = '0 0 0 3px rgba(196,163,90,0.2)';
});

logoWrap.addEventListener('dragleave', () => {
  logoWrap.style.borderColor = '';
  logoWrap.style.boxShadow   = '';
});

logoWrap.addEventListener('drop', e => {
  e.preventDefault();
  logoWrap.style.borderColor = '';
  logoWrap.style.boxShadow   = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById('logoImg');
      img.src = ev.target.result;
      img.style.display = 'block';
      document.getElementById('logoFallback').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

logoWrap.addEventListener('click', () => {
  const picker = document.createElement('input');
  picker.type   = 'file';
  picker.accept = 'image/*';
  picker.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById('logoImg');
      img.src = ev.target.result;
      img.style.display = 'block';
      document.getElementById('logoFallback').style.display = 'none';
    };
    reader.readAsDataURL(file);
  };
  picker.click();
});


/* ════════════════════════════════════════
   CLEAR ERRORS ON INPUT
════════════════════════════════════════ */
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => { if (input.id) clearError(input.id); });
});


/* ════════════════════════════════════════
   EXPOSE FUNCTIONS TO HTML (module scope fix)
════════════════════════════════════════ */
window.showLogin    = showLogin;
window.showSignup   = showSignup;
window.togglePass   = togglePass;
window.checkStrength= checkStrength;
window.handleLogin  = handleLogin;
window.handleSignup = handleSignup;
window.closeSuccess = closeSuccess;


/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
showLogin();
