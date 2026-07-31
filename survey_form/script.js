/* ==========================================================================
   Second Story — Preworn Fashion Survey Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let currentStep = 1;
    const totalSteps = 4;

    // DOM Elements
    const surveyForm = document.getElementById('surveyForm');
    const sections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const errorBanner = document.getElementById('errorBanner');
    const errorMessage = document.getElementById('errorMessage');

    const progressWrapper = document.getElementById('progressWrapper');
    const progressBarFill = document.getElementById('progressBarFill');
    const stepCounterText = document.getElementById('stepCounterText');
    const progressPercentage = document.getElementById('progressPercentage');
    const stepDots = document.querySelectorAll('.step-dot');

    const confirmationCard = document.getElementById('confirmationCard');
    const summaryContent = document.getElementById('summaryContent');
    const newResponseBtn = document.getElementById('newResponseBtn');

    // Questions list mapping for display summary
    const questionLabels = {
        'entry.236224908': 'Gender',
        'entry.921532506': 'Age Range',
        'entry.1801662950': 'Occupation',
        'entry.1701656037': 'Bangalore Area',
        'entry.317039661': 'Monthly Fashion Spend',
        'entry.641614989': 'Shopping Frequency',
        'entry.2130890888': 'Usual Shopping Places',
        'entry.1852072366': 'Luxury Purchase (Last 12 Mo)',
        'entry.1330194199': 'Unused Clothes Destination',
        'entry.1656920273': 'Ever Sold Preowned',
        'entry.1726210043': 'Main Reasons to Sell',
        'entry.819080465': 'Barriers to Selling Online',
        'entry.544833170': 'Comfort Factors when Buying',
        'entry.1915593258': 'Most Important Factors',
        'entry.21080423': 'Preferred Platform Model',
        'entry.1398588771': 'Trust & Marketplace Feedback'
    };

    // Initialize Card Event Listeners
    initOptionCards();
    updateStepUI();

    // Option Card Selection & Toggle Logic
    function initOptionCards() {
        const optionCards = document.querySelectorAll('.option-card');
        
        optionCards.forEach(card => {
            const input = card.querySelector('input');

            card.addEventListener('click', (e) => {
                // If user clicked directly on the input, let browser handle value change
                if (e.target.tagName !== 'INPUT') {
                    if (input.type === 'radio') {
                        input.checked = true;
                    } else if (input.type === 'checkbox') {
                        input.checked = !input.checked;
                    }
                    // Dispatch change event to trigger handlers
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            if (input) {
                input.addEventListener('change', () => {
                    handleInputChange(input, card);
                });
            }
        });
    }

    function handleInputChange(input, card) {
        hideError();

        if (input.type === 'radio') {
            // Unselect sibling radio cards in the same group
            const name = input.name;
            const sameGroupCards = document.querySelectorAll(`input[name="${name}"]`);
            sameGroupCards.forEach(r => {
                const parentCard = r.closest('.option-card');
                if (parentCard) parentCard.classList.remove('selected');
                
                // Hide associated "Other" input if present
                const otherTargetId = r.getAttribute('data-other-target');
                if (otherTargetId) {
                    const otherContainer = document.getElementById(otherTargetId);
                    if (otherContainer) {
                        otherContainer.classList.add('hidden');
                        const textInput = otherContainer.querySelector('input');
                        if (textInput) textInput.required = false;
                    }
                }
            });

            card.classList.add('selected');

            // Handle "Other" radio target
            const otherTargetId = input.getAttribute('data-other-target');
            if (input.checked && otherTargetId) {
                const otherContainer = document.getElementById(otherTargetId);
                if (otherContainer) {
                    otherContainer.classList.remove('hidden');
                    const textInput = otherContainer.querySelector('input');
                    if (textInput) {
                        textInput.required = true;
                        textInput.focus();
                    }
                }
            }
        } 
        else if (input.type === 'checkbox') {
            if (input.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }

            // Handle "Other" checkbox target
            const otherTargetId = input.getAttribute('data-other-target');
            if (otherTargetId) {
                const otherContainer = document.getElementById(otherTargetId);
                if (otherContainer) {
                    if (input.checked) {
                        otherContainer.classList.remove('hidden');
                        const textInput = otherContainer.querySelector('input');
                        if (textInput) {
                            textInput.required = true;
                            textInput.focus();
                        }
                    } else {
                        otherContainer.classList.add('hidden');
                        const textInput = otherContainer.querySelector('input');
                        if (textInput) textInput.required = false;
                    }
                }
            }
        }
    }

    // Step Dots Navigation Click Handler - Allows free navigation anytime
    stepDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetStep = parseInt(dot.getAttribute('data-step'));
            currentStep = targetStep;
            updateStepUI();
        });
    });

    // Previous Button Click
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
        }
    });

    // Next Button Click - Allows advancing freely
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepUI();
        }
    });

    // Update UI for active section and step indicators
    function updateStepUI() {
        hideError();

        sections.forEach((sec, idx) => {
            if (parseInt(sec.getAttribute('data-section')) === currentStep) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });

        // Update Section Step Text
        stepCounterText.textContent = `Section ${currentStep} of ${totalSteps}`;

        // Calculate progress based on answered questions count
        updateProgressBar();

        // Update Step Dots
        stepDots.forEach(dot => {
            const stepNum = parseInt(dot.getAttribute('data-step'));
            dot.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                dot.classList.add('active');
            } else if (stepNum < currentStep) {
                dot.classList.add('completed');
            }
        });

        // Update Nav Buttons Visibility
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Calculate progress percentage based on actual answered questions
    function updateProgressBar() {
        const allQuestionGroups = document.querySelectorAll('.question-group');
        const totalQuestions = allQuestionGroups.length;
        let answeredCount = 0;

        allQuestionGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            const textarea = group.querySelector('textarea');
            const textInput = group.querySelector('.other-text-input');

            let isAnswered = false;

            if (radios.length > 0) {
                const checkedRadio = group.querySelector('input[type="radio"]:checked');
                if (checkedRadio) {
                    if (checkedRadio.value === '__other_option__') {
                        if (textInput && textInput.value.trim().length > 0) {
                            isAnswered = true;
                        }
                    } else {
                        isAnswered = true;
                    }
                }
            } else if (checkboxes.length > 0) {
                const checkedBoxes = group.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedBoxes.length > 0) {
                    isAnswered = true;
                }
            } else if (textarea) {
                if (textarea.value.trim().length > 0) {
                    isAnswered = true;
                }
            }

            if (isAnswered) {
                answeredCount++;
            }
        });

        const percentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
        progressBarFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}% Completed (${answeredCount}/${totalQuestions})`;
    }

    // Synchronize Question 7 ratings to Google Form hidden inputs entry.2130890888
    function syncShopsRatings() {
        const hiddenContainer = document.getElementById('hidden-shops-entries');
        if (!hiddenContainer) return;
        
        hiddenContainer.innerHTML = '';
        
        const ratingRows = document.querySelectorAll('#group-shops .rating-row');
        ratingRows.forEach(row => {
            const checked = row.querySelector('input[type="radio"]:checked');
            if (checked) {
                let val = checked.value;
                if (checked.name === 'shop_other') {
                    const otherName = document.getElementById('shop-other-name');
                    const nameStr = (otherName && otherName.value.trim()) ? otherName.value.trim() : 'Other';
                    val = `${nameStr} (${checked.getAttribute('data-rate')}/5)`;
                }
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'entry.2130890888';
                input.value = val;
                hiddenContainer.appendChild(input);
            }
        });
    }

    const groupShops = document.getElementById('group-shops');
    if (groupShops) {
        groupShops.addEventListener('change', () => {
            syncShopsRatings();
            updateProgressBar();
        });
        const otherInput = document.getElementById('shop-other-name');
        if (otherInput) {
            otherInput.addEventListener('input', syncShopsRatings);
        }
    }

    // Synchronize Question 9 ratings to Google Form hidden inputs entry.1330194199
    function syncUnusedRatings() {
        const hiddenContainer = document.getElementById('hidden-unused-entries');
        if (!hiddenContainer) return;
        
        hiddenContainer.innerHTML = '';
        
        const ratingRows = document.querySelectorAll('#group-unused .rating-row');
        ratingRows.forEach(row => {
            const checked = row.querySelector('input[type="radio"]:checked');
            if (checked) {
                let val = checked.value;
                if (checked.name === 'unused_other') {
                    const otherName = document.getElementById('unused-other-name');
                    const nameStr = (otherName && otherName.value.trim()) ? otherName.value.trim() : 'Other';
                    val = `${nameStr} (${checked.getAttribute('data-rate')}/5)`;
                }
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'entry.1330194199';
                input.value = val;
                hiddenContainer.appendChild(input);
            }
        });
    }

    const groupUnused = document.getElementById('group-unused');
    if (groupUnused) {
        groupUnused.addEventListener('change', () => {
            syncUnusedRatings();
            updateProgressBar();
        });
        const otherInput = document.getElementById('unused-other-name');
        if (otherInput) {
            otherInput.addEventListener('input', syncUnusedRatings);
        }
    }

    // Synchronize Question 11 ratings to Google Form hidden inputs entry.1726210043
    function syncReasonSellRatings() {
        const hiddenContainer = document.getElementById('hidden-reasonsell-entries');
        if (!hiddenContainer) return;
        
        hiddenContainer.innerHTML = '';
        
        const ratingRows = document.querySelectorAll('#group-reasonsell .rating-row');
        ratingRows.forEach(row => {
            const checked = row.querySelector('input[type="radio"]:checked');
            if (checked) {
                let val = checked.value;
                if (checked.name === 'reasonsell_other') {
                    const otherName = document.getElementById('reasonsell-other-name');
                    const nameStr = (otherName && otherName.value.trim()) ? otherName.value.trim() : 'Other';
                    val = `${nameStr} (${checked.getAttribute('data-rate')}/5)`;
                }
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'entry.1726210043';
                input.value = val;
                hiddenContainer.appendChild(input);
            }
        });
    }

    const groupReasonSell = document.getElementById('group-reasonsell');
    if (groupReasonSell) {
        groupReasonSell.addEventListener('change', () => {
            syncReasonSellRatings();
            updateProgressBar();
        });
        const otherInput = document.getElementById('reasonsell-other-name');
        if (otherInput) {
            otherInput.addEventListener('input', syncReasonSellRatings);
        }
    }

    // Synchronize Question 12 ratings to Google Form hidden inputs entry.819080465
    function syncStopSellRatings() {
        const hiddenContainer = document.getElementById('hidden-stopsell-entries');
        if (!hiddenContainer) return;
        hiddenContainer.innerHTML = '';
        const ratingRows = document.querySelectorAll('#group-stopsell .rating-row');
        ratingRows.forEach(row => {
            const checked = row.querySelector('input[type="radio"]:checked');
            if (checked) {
                let val = checked.value;
                if (checked.name === 'stopsell_other') {
                    const otherName = document.getElementById('stopsell-other-name');
                    const nameStr = (otherName && otherName.value.trim()) ? otherName.value.trim() : 'Other';
                    val = `${nameStr} (${checked.getAttribute('data-rate')}/5)`;
                }
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'entry.819080465';
                input.value = val;
                hiddenContainer.appendChild(input);
            }
        });
    }

    const groupStopSell = document.getElementById('group-stopsell');
    if (groupStopSell) {
        groupStopSell.addEventListener('change', () => {
            syncStopSellRatings();
            updateProgressBar();
        });
        const otherInput = document.getElementById('stopsell-other-name');
        if (otherInput) otherInput.addEventListener('input', syncStopSellRatings);
    }

    // Synchronize Question 13 ratings to Google Form hidden inputs entry.544833170
    function syncBuyingComfortRatings() {
        const hiddenContainer = document.getElementById('hidden-buyingcomfort-entries');
        if (!hiddenContainer) return;
        hiddenContainer.innerHTML = '';
        const ratingRows = document.querySelectorAll('#group-buyingcomfort .rating-row');
        ratingRows.forEach(row => {
            const checked = row.querySelector('input[type="radio"]:checked');
            if (checked) {
                let val = checked.value;
                if (checked.name === 'comfort_other') {
                    const otherName = document.getElementById('comfort-other-name');
                    const nameStr = (otherName && otherName.value.trim()) ? otherName.value.trim() : 'Other';
                    val = `${nameStr} (${checked.getAttribute('data-rate')}/5)`;
                }
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'entry.544833170';
                input.value = val;
                hiddenContainer.appendChild(input);
            }
        });
    }

    const groupBuyingComfort = document.getElementById('group-buyingcomfort');
    if (groupBuyingComfort) {
        groupBuyingComfort.addEventListener('change', () => {
            syncBuyingComfortRatings();
            updateProgressBar();
        });
        const otherInput = document.getElementById('comfort-other-name');
        if (otherInput) otherInput.addEventListener('input', syncBuyingComfortRatings);
    }

    // Synchronize Question 14 ratings to Google Form hidden inputs entry.1915593258
    function syncMattersMostRatings() {
        const hiddenContainer = document.getElementById('hidden-mattersmost-entries');
        if (!hiddenContainer) return;
        hiddenContainer.innerHTML = '';
        const ratingRows = document.querySelectorAll('#group-mattersmost .rating-row');
        ratingRows.forEach(row => {
            const checked = row.querySelector('input[type="radio"]:checked');
            if (checked) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'entry.1915593258';
                input.value = checked.value;
                hiddenContainer.appendChild(input);
            }
        });
    }

    const groupMattersMost = document.getElementById('group-mattersmost');
    if (groupMattersMost) {
        groupMattersMost.addEventListener('change', () => {
            syncMattersMostRatings();
            updateProgressBar();
        });
    }

    // Attach real-time input listeners to form to update progress live on answer input
    surveyForm.addEventListener('change', updateProgressBar);
    surveyForm.addEventListener('input', updateProgressBar);

    // Section Validation
    function validateCurrentSection() {
        const activeSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
        const questionGroups = activeSection.querySelectorAll('.question-group');
        let isValid = true;
        let firstErrorGroup = null;

        questionGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            const otherInput = group.querySelector('.other-text-input');

            let groupAnswered = true;

            if (radios.length > 0) {
                const checkedRadio = group.querySelector('input[type="radio"]:checked');
                if (!checkedRadio) {
                    groupAnswered = false;
                } else if (checkedRadio.value === '__other_option__' && otherInput) {
                    if (!otherInput.value.trim()) {
                        groupAnswered = false;
                    }
                }
            } else if (checkboxes.length > 0) {
                const checkedBoxes = group.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedBoxes.length === 0) {
                    groupAnswered = false;
                } else {
                    checkedBoxes.forEach(cb => {
                        if (cb.value === '__other_option__' && otherInput && !otherInput.value.trim()) {
                            groupAnswered = false;
                        }
                    });
                }
            }

            if (!groupAnswered) {
                isValid = false;
                if (!firstErrorGroup) firstErrorGroup = group;
            }
        });

        if (!isValid) {
            showError('Please complete all required fields before moving forward.');
            if (firstErrorGroup) {
                firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isValid;
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorBanner.classList.remove('hidden');
    }

    function hideError() {
        errorBanner.classList.add('hidden');
    }

    // Form Submission Handling
    surveyForm.addEventListener('submit', (e) => {
        // Show spinner state
       const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsGO9oQSVGAyua-
  4rPXoXrCIe0NaLWytLxF46rq0G57xGSVt5r8z2Zsn2N9GA1ndVO/exec';
        submitSpinner.classList.remove('hidden');
        submitBtn.disabled = true;

        const payload = {
                gender: surveyForm.querySelector('input[name="entry.236224908"]:checked')?.value || '',
                age: surveyForm.querySelector('input[name="entry.921532506"]:checked')?.value || '',
                occupation: surveyForm.querySelector('input[name="entry.1801662950"]:checked')?.value || '',
                area: surveyForm.querySelector('input[name="entry.1701656037"]:checked')?.value || '',
                monthlySpend: surveyForm.querySelector('input[name="entry.317039661"]:checked')?.value || '',
                shoppingFreq: surveyForm.querySelector('input[name="entry.641614989"]:checked')?.value || '',
                luxuryPurchase: surveyForm.querySelector('input[name="entry.1852072366"]:checked')?.value || '',
                everSold: surveyForm.querySelector('input[name="entry.1656920273"]:checked')?.value || '',
                preferredModel: surveyForm.querySelector('input[name="entry.21080423"]:checked')?.value || '',
                trustFeedback: surveyForm.querySelector('textarea[name="entry.1398588771"]')?.value || ''
            };

            if (GOOGLE_APPS_SCRIPT_URL) {
                fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload),
                    mode: 'no-cors'
                }).catch(err => console.error("Post error:", err));
            }
        // Flag for iframe onload handler
        window.submitted = true;

        // Fallback timer if iframe load isn't triggered (e.g. CORS block notice)
        setTimeout(() => {
            handleFormSubmitted();
        }, 1500);
    });

    // Form Submitted Handler
    window.handleFormSubmitted = function() {
        submitSpinner.classList.add('hidden');
        submitBtn.disabled = false;

        // Hide form & progress wrapper
        surveyForm.classList.add('hidden');
        progressWrapper.classList.add('hidden');

        // Populate Summary
        renderSummary();

        // Show Confirmation
        confirmationCard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render Response Summary
    function renderSummary() {
        const formData = new FormData(surveyForm);
        const summaryMap = {};

        for (let [key, val] of formData.entries()) {
            if (!val || val === '__other_option__') continue;
            
            if (key.endsWith('.other_option_response')) {
                // Attach custom text value to parent key
                const baseKey = key.replace('.other_option_response', '');
                if (summaryMap[baseKey]) {
                    summaryMap[baseKey].push(`Other: "${val}"`);
                } else {
                    summaryMap[baseKey] = [`Other: "${val}"`];
                }
            } else {
                if (summaryMap[key]) {
                    summaryMap[key].push(val);
                } else {
                    summaryMap[key] = [val];
                }
            }
        }

        summaryContent.innerHTML = '';
        
        Object.keys(questionLabels).forEach(key => {
            const answers = summaryMap[key];
            if (answers && answers.length > 0) {
                const item = document.createElement('div');
                item.className = 'summary-item';
                
                const qLabel = document.createElement('div');
                qLabel.className = 'summary-q';
                qLabel.textContent = questionLabels[key];

                const aLabel = document.createElement('div');
                aLabel.className = 'summary-a';
                aLabel.textContent = answers.join(', ');

                item.appendChild(qLabel);
                item.appendChild(aLabel);
                summaryContent.appendChild(item);
            }
        });
    }

    // Submit Another Response Handler
    newResponseBtn.addEventListener('click', () => {
        surveyForm.reset();
        
        // Reset option card selections
        document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.other-input-container').forEach(cont => cont.classList.add('hidden'));

        confirmationCard.classList.add('hidden');
        surveyForm.classList.remove('hidden');
        progressWrapper.classList.remove('hidden');

        currentStep = 1;
        updateStepUI();
    });

});
