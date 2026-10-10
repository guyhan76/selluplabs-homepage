'use strict';

// A fixed business recipient; customers never supply an email destination.
window.bindYounghwaQuoteForm = function (form, t) {
  const status = form.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const languageButton = document.querySelector('.language');
  let pending = false;

  form.addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  });

  form.onsubmit = async event => {
    event.preventDefault();
    if (pending) return;
    for (const name of ['name', 'phone', 'details']) {
      const field = form.elements.namedItem(name);
      field.setCustomValidity(field.value.trim() ? '' : t('내용을 입력해주세요.', 'Please enter a value.'));
    }
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    if (String(values.get('_honey') || '').trim()) return;

    const payload = {
      name: String(values.get('name')).trim(),
      phone: String(values.get('phone')).trim(),
      type: String(values.get('type')),
      message: String(values.get('details')).trim(),
      _subject: `[영화패키지 견적문의] ${values.get('type')}`,
      _template: 'table',
      _honey: '',
    };
    pending = true;
    const controls = [...form.querySelectorAll('input, select, textarea, button')];
    const disabled = controls.map(control => control.disabled);
    controls.forEach(control => { control.disabled = true; });
    const previousLanguageDisabled = languageButton?.disabled;
    if (languageButton) languageButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    const previousButton = button.innerHTML;
    button.textContent = t('전송 중…', 'Sending…');
    status.dataset.state = 'pending';
    status.textContent = t('문의 내용을 전송하고 있습니다.', 'Sending your enquiry.');
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 20000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/lis000@hanmail.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: abort.signal,
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin',
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('REJECTED');
      // First-time activation is an operator action, not a delivered enquiry.
      if (/activat|confirm.{0,30}email|verify.{0,30}email/i.test(String(result.message || ''))) {
        status.dataset.state = 'error';
        status.textContent = t('이메일 수신 설정 확인이 필요합니다. 입력 내용은 유지됩니다. 급한 문의는 1644-1410으로 연락해주세요.', 'Email receiving setup needs verification. Your details are kept. For urgent enquiries, call 1644-1410.');
      } else {
        status.dataset.state = 'success';
        status.textContent = t('문의 전송 요청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.', 'Your enquiry submission was accepted. Our team will contact you after reviewing it.');
        form.reset();
      }
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error?.message === 'REJECTED'
        ? t('문의를 전송하지 못했습니다. 입력 내용을 유지했으니 잠시 후 다시 시도하거나 1644-1410으로 연락해주세요.', 'Your enquiry could not be sent. Your details are kept. Try again later or call 1644-1410.')
        : t('전송 결과를 확인하지 못했습니다. 중복 접수를 피하려면 1644-1410으로 접수 여부를 확인해주세요. 입력 내용은 유지됩니다.', 'We could not confirm the result. Call 1644-1410 to check before resubmitting. Your details are kept.');
    } finally {
      clearTimeout(timeout);
      pending = false;
      controls.forEach((control, index) => { control.disabled = disabled[index]; });
      if (languageButton) languageButton.disabled = previousLanguageDisabled;
      form.removeAttribute('aria-busy');
      button.innerHTML = previousButton;
    }
  };
};
