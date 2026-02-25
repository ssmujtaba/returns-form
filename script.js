/**
 * =====================================================
 * FERGUS MEDICAL — RETURN AUTHORIZATION FORM
 * script.js
 *
 * HOW IT WORKS:
 * 1. Customer fills out the form and hits Submit.
 * 2. EmailJS sends two emails:
 *    a) Confirmation to the customer (if they include email — optional enhancement).
 *    b) Notification to sean@fergus-medical.com with a special "staff review link"
 *       that encodes all the customer's submitted data in the URL.
 * 3. When Sean clicks the staff link, the form opens in Staff Mode:
 *    - All customer fields are locked (read-only).
 *    - All internal fields (tracking #, auth request, approval, date) are unlocked.
 * 4. Sean fills in the internal fields and clicks "Save Internal Notes".
 *    - This sends a final completion email to orders@fergus-medical.com with
 *      all the data (customer + internal).
 *
 * =====================================================
 * SETUP INSTRUCTIONS — READ BEFORE DEPLOYING
 * =====================================================
 *
 * STEP 1: Create a free EmailJS account at https://emailjs.com
 *
 * STEP 2: Add an Email Service:
 *   - Go to "Email Services" → Add New Service
 *   - Choose Gmail (or Outlook/etc.) and connect orders@fergus-medical.com
 *     OR connect any email account you check. EmailJS just needs SMTP access.
 *   - Copy the Service ID → paste into EMAILJS_SERVICE_ID below.
 *
 * STEP 3: Create TWO Email Templates:
 *
 *   Template A — "Staff Review Notification" (sent when customer submits):
 *   Template ID: paste into EMAILJS_TEMPLATE_STAFF below
 *   Template Variables to use in your EmailJS template:
 *     {{company_name}}, {{provider_name}}, {{invoice_number}}, {{phone_number}},
 *     {{products_html}}, {{review_link}}
 *   Suggested subject: "New Return Request from {{company_name}} — Action Required"
 *   Suggested body:
 *     A new return authorization request has been submitted.
 *     Company: {{company_name}}
 *     Provider: {{provider_name}}
 *     Invoice: {{invoice_number}}
 *     Phone: {{phone_number}}
 *     Products:
 *     {{products_html}}
 *     Click here to open the staff review form: {{review_link}}
 *
 *   Template B — "Internal Completion Record" (sent when staff saves):
 *   Template ID: paste into EMAILJS_TEMPLATE_COMPLETE below
 *   Template Variables:
 *     {{company_name}}, {{provider_name}}, {{invoice_number}}, {{phone_number}},
 *     {{products_html}}, {{tracking_number}}, {{auth_request}}, {{auth_approval}},
 *     {{auth_date}}
 *   Suggested subject: "Return Authorization COMPLETED — {{auth_request}}"
 *   Suggested body: whatever format you'd like for your records.
 *
 * STEP 4: Copy your Public Key from EmailJS → Account → API Keys
 *   Paste into EMAILJS_PUBLIC_KEY below.
 *
 * STEP 5: Update the STAFF_EMAIL and SITE_URL variables below.
 *
 * =====================================================
 */

// =====================================================
// ⚙️  CONFIGURATION — FILL THESE IN
// =====================================================

const EMAILJS_PUBLIC_KEY   = 'ZRQYiwsDNeifViSPu';
const EMAILJS_SERVICE_ID   = 'service_i16un12';
const EMAILJS_TEMPLATE_STAFF    = 'template_0xfoet8';
const EMAILJS_TEMPLATE_COMPLETE = 'template_m6g9cd7';

const STAFF_EMAIL = 'sean@fergus-medical.com';
const SITE_URL    = 'https://ssmujtaba.github.io/returns-form/'; // Your live URL (with trailing slash)

// =====================================================
// APP STATE
// =====================================================

let isStaffMode = false;

// =====================================================
// INIT
// =====================================================

window.addEventListener('DOMContentLoaded', function () {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const params = new URLSearchParams(window.location.search);

    if (params.get('mode') === 'staff' && params.has('Company_Name')) {
        // Staff review mode
        enterStaffMode(params);
    } else {
        // Normal customer mode — add the first blank row
        addRow();
    }
});

// =====================================================
// ROW MANAGEMENT
// =====================================================

function addRow() {
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="field-input customer-field row-reason" placeholder="e.g. QCRO-020526" required></td>
        <td><input type="text" class="field-input customer-field row-product" placeholder="e.g. 2x3 Amchoplast" required></td>
        <td><input type="text" class="field-input customer-field row-tissue" placeholder="e.g. 626005003" required></td>
        <td class="action-col">
            <button type="button" class="btn-remove-row" title="Remove row" onclick="removeRow(this)">×</button>
        </td>
    `;
    tbody.appendChild(row);

    // Focus first input of newly added row
    row.querySelector('input').focus();
}

function removeRow(btn) {
    const tbody = document.getElementById('tableBody');
    const row = btn.closest('tr');

    // Don't remove if it's the only row
    if (tbody.querySelectorAll('tr').length <= 1) {
        // Just clear the inputs instead
        row.querySelectorAll('input').forEach(inp => inp.value = '');
        return;
    }

    row.style.transition = 'opacity 0.2s, transform 0.2s';
    row.style.opacity = '0';
    row.style.transform = 'translateX(8px)';
    setTimeout(() => row.remove(), 200);
}

// =====================================================
// COLLECT FORM DATA
// =====================================================

function getFormData() {
    const data = {
        company_name:   document.getElementById('companyName').value.trim(),
        provider_name:  document.getElementById('providerName').value.trim(),
        invoice_number: document.getElementById('invoiceNumber').value.trim(),
        phone_number:   document.getElementById('phoneNumber').value.trim(),
        products: []
    };

    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const reason  = row.querySelector('.row-reason')?.value.trim() || '';
        const product = row.querySelector('.row-product')?.value.trim() || '';
        const tissue  = row.querySelector('.row-tissue')?.value.trim() || '';
        if (reason || product || tissue) {
            data.products.push({ reason, product, tissue });
        }
    });

    return data;
}

function buildProductsHTML(products) {
    if (!products.length) return '<tbody><tr><td colspan="3">(no products listed)</td></tr></tbody>';
    let html = '<tbody>';
    products.forEach((p, i) => {
        const bg = i % 2 === 0 ? '#ffffff' : '#f5f9fb';
        html += '<tr style="background:' + bg + ';"><td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">' + p.reason + '</td><td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">' + p.product + '</td><td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">' + p.tissue + '</td></tr>';
    });
    html += '</tbody>';
    return html;
}

// =====================================================
// VALIDATION
// =====================================================

function validateForm() {
    const data = getFormData();
    const errors = [];

    if (!data.company_name)  errors.push('Company Name is required.');
    if (!data.provider_name) errors.push('Provider Name is required.');
    if (!data.phone_number)  errors.push('Telephone number is required.');

    if (data.products.length === 0) {
        errors.push('Please add at least one product row.');
    } else {
        data.products.forEach((p, i) => {
            if (!p.reason)  errors.push(`Row ${i+1}: Reason for Return is required.`);
            if (!p.product) errors.push(`Row ${i+1}: Product / Size is required.`);
            if (!p.tissue)  errors.push(`Row ${i+1}: Tissue ID is required.`);
        });
    }

    return errors;
}

// =====================================================
// BUILD STAFF REVIEW LINK
// =====================================================

function buildReviewLink(data) {
    const url = new URL(SITE_URL);
    url.searchParams.set('mode', 'staff');
    url.searchParams.set('Company_Name',   data.company_name);
    url.searchParams.set('Provider_Name',  data.provider_name);
    url.searchParams.set('Invoice_Number', data.invoice_number);
    url.searchParams.set('Phone_Number',   data.phone_number);

    // Encode each product as JSON in a separate param
    data.products.forEach((p, i) => {
        url.searchParams.set(`product_${i}`, JSON.stringify(p));
    });

    // Store product count so we know how many to decode
    url.searchParams.set('product_count', data.products.length);

    return url.toString();
}

// =====================================================
// CUSTOMER SUBMIT
// =====================================================

function handleSubmit() {
    // Hide previous messages
    showMsg('error', '');
    showMsg('success', '');

    const errors = validateForm();
    if (errors.length > 0) {
        showMsg('error', errors.join('<br>'));
        return;
    }

    const data = getFormData();
    const reviewLink = buildReviewLink(data);
    const productsHTML = buildProductsHTML(data.products);

    // Disable button, show spinner
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    document.getElementById('submitBtnText').textContent = 'Sending…';
    document.getElementById('submitBtnSpinner').style.display = 'inline-block';

    // Send email to Sean with the staff review link
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_STAFF, {
        to_email:       STAFF_EMAIL,
        company_name:   data.company_name,
        provider_name:  data.provider_name,
        invoice_number: data.invoice_number || '(not provided)',
        phone_number:   data.phone_number,
        products_html:  productsHTML,
        review_link:    reviewLink,
    })
    .then(function () {
        // Success: redirect to thanks page
        window.location.href = 'thanks.html';
    })
    .catch(function (err) {
        console.error('EmailJS error:', err);

        // Re-enable button
        btn.disabled = false;
        document.getElementById('submitBtnText').textContent = 'Submit Return Request';
        document.getElementById('submitBtnSpinner').style.display = 'none';

        showMsg('error',
            'There was an error sending your submission. Please try again, or email ' +
            '<strong>orders@fergus-medical.com</strong> directly if the problem persists.'
        );
    });
}

// =====================================================
// STAFF MODE — ENTER
// =====================================================

function enterStaffMode(params) {
    isStaffMode = true;

    // Add staff banner
    const banner = document.createElement('div');
    banner.className = 'staff-mode-banner';
    banner.innerHTML = `
        <span class="banner-icon">🔐</span>
        <strong>STAFF REVIEW MODE</strong> — Customer fields are locked. 
        Fill in the internal fields below and click "Save Internal Notes" to complete the authorization.
    `;
    const formContainer = document.getElementById('formContainer');
    const header = formContainer.querySelector('.form-header');
    formContainer.insertBefore(banner, header.nextSibling);

    // Pre-fill customer fields and lock them
    setField('companyName',   params.get('Company_Name'));
    setField('providerName',  params.get('Provider_Name'));
    setField('invoiceNumber', params.get('Invoice_Number'));
    setField('phoneNumber',   params.get('Phone_Number'));

    // Lock all customer fields
    document.querySelectorAll('.customer-field').forEach(input => {
        input.readOnly = true;
        input.classList.add('locked');
    });

    // Restore product rows
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    const count = parseInt(params.get('product_count')) || 0;

    for (let i = 0; i < count; i++) {
        const p = JSON.parse(params.get(`product_${i}`) || '{}');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="field-input" value="${escHtml(p.reason || '')}" readonly></td>
            <td><input type="text" class="field-input" value="${escHtml(p.product || '')}" readonly></td>
            <td><input type="text" class="field-input" value="${escHtml(p.tissue || '')}" readonly></td>
            <td class="action-col"></td>
        `;
        tbody.appendChild(row);
    }

    // Hide add row button and action column header
    document.getElementById('addRowBtn').style.display = 'none';
    document.getElementById('actionColHeader').style.display = 'none';

    // Unlock internal fields
    document.querySelectorAll('.internal-field').forEach(input => {
        input.readOnly = false;
        input.classList.add('unlocked');
        input.placeholder = '';
    });

    // Show staff save button, hide customer submit
    document.getElementById('submitArea').style.display = 'none';
    document.getElementById('staffSaveArea').style.display = 'flex';

    // Auto-fill date if empty
    const dateField = document.getElementById('authDate');
    if (!dateField.value) {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const yy = String(today.getFullYear()).slice(-2);
        dateField.value = `${mm}/${dd}/${yy}`;
    }
}

// =====================================================
// STAFF SAVE
// =====================================================

function handleStaffSave() {
    const trackingNum = document.getElementById('trackingNumber').value.trim();
    const authRequest = document.getElementById('authRequestNum').value.trim();
    const authApproval = document.getElementById('authApproval').value.trim();
    const authDate = document.getElementById('authDate').value.trim();

    const missing = [];
    if (!trackingNum)  missing.push('Return Tracking #');
    if (!authRequest)  missing.push('Authorization Request #');
    if (!authApproval) missing.push('Return Authorization Approval');
    if (!authDate)     missing.push('Date');

    if (missing.length > 0) {
        showMsg('error', 'Please fill in: ' + missing.join(', '));
        return;
    }

    // Collect all data for completion record
    const params = new URLSearchParams(window.location.search);
    const products = [];
    const count = parseInt(params.get('product_count')) || 0;
    for (let i = 0; i < count; i++) {
        const p = JSON.parse(params.get(`product_${i}`) || '{}');
        products.push(p);
    }

    const productsHTML = buildProductsHTML(products);

    // Disable button
    const btn = document.querySelector('.btn-staff-save');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_COMPLETE, {
        to_email:       'orders@fergus-medical.com',
        company_name:   document.getElementById('companyName').value,
        provider_name:  document.getElementById('providerName').value,
        invoice_number: document.getElementById('invoiceNumber').value || '(not provided)',
        phone_number:   document.getElementById('phoneNumber').value,
        products_html:  productsHTML,
        tracking_number: trackingNum,
        auth_request:   authRequest,
        auth_approval:  authApproval,
        auth_date:      authDate,
    })
    .then(function () {
        btn.textContent = '✓ Authorization Saved';
        btn.style.background = 'linear-gradient(135deg, #1a5c2a, #2a8a40)';
        showMsg('success',
            `✓ Return Authorization <strong>${authRequest}</strong> has been completed and saved. ` +
            `A record has been sent to orders@fergus-medical.com.`
        );
        // Lock internal fields now too
        document.querySelectorAll('.internal-field').forEach(input => {
            input.readOnly = true;
            input.classList.remove('unlocked');
        });
    })
    .catch(function (err) {
        console.error('EmailJS error:', err);
        btn.disabled = false;
        btn.textContent = 'Save Internal Notes & Complete Authorization';
        showMsg('error', 'Error saving. Please try again or contact IT support.');
    });
}

// =====================================================
// HELPERS
// =====================================================

function setField(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

function showMsg(type, html) {
    const el = document.getElementById(type === 'error' ? 'errorMsg' : 'successMsg');
    if (!el) return;
    if (!html) {
        el.style.display = 'none';
        el.innerHTML = '';
        return;
    }
    el.innerHTML = html;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
