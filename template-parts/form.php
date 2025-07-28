<div class="popup-wrap" id="popup-1">
    <div class="popup">
        <div class="close-button"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M15.227 15.227C15.5199 14.9341 15.9948 14.9341 16.2877 15.227L20 18.9393L23.7123 15.227C24.0052 14.9341 24.48 14.9341 24.7729 15.227C25.0658 15.5199 25.0658 15.9948 24.7729 16.2877L21.0606 20L24.7729 23.7123C25.0658 24.0052 25.0658 24.48 24.7729 24.7729C24.48 25.0658 24.0052 25.0658 23.7123 24.7729L20 21.0606L16.2877 24.7729C15.9948 25.0658 15.5199 25.0658 15.227 24.7729C14.9341 24.48 14.9341 24.0052 15.227 23.7123L18.9393 20L15.227 16.2877C14.9341 15.9948 14.9341 15.5199 15.227 15.227Z"
                    fill="#C7C7CC" />
            </svg>
        </div>
        <div class="form-block">
            <h2>Contact us</h2>
            <form method="post" id="basic_form">
            <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response">
                <div class="input-items">
                    <input type="hidden" name="name-form" value="Contact us">
                    <div class=" input-item">
                        <input id="basic_name" type="text" class="name" name="name" placeholder="Your name *" />
                        <label for="">Your name <span>*</span></label>
                    </div>
                    <div class="input-item">

                        <input id="basic_email" type="email" name="email" placeholder="You work email *">
                        <label for="basic_email">You work email <span>*</span></label>
                    </div>
                    <div class="input-item">

                        <textarea name="comment" id="comment" placeholder="Message"></textarea>
                        <label for="comment">Message</label>
                    </div>
                    <button class="form-button" type=" submit">Submit</button>
                </div>


            </form>
        </div>
        <div class="success">
            <h3>Thanks for getting in touch!</h3>
            <p> We’re reviewing it now and will respond soon.</p>
        </div>
        <div class="invalid">Error sending message. Please try again later.</div>
        <div class="popup-bottom">
            <div class="logo"><img src="<?php echo get_template_directory_uri() ?>/assets/images/logo-popup.svg" />
            </div>
            <p>By submitting this form I agree that LBOARD may collect, process and retain my data in accordance
                with its <a href="/privacy-policy/">Privacy Policy.</a>
            </p>
        </div>



    </div>
</div>


<div class="popup-wrap" id="popup-2">
    <div class="popup">
        <div class="close-button"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M15.227 15.227C15.5199 14.9341 15.9948 14.9341 16.2877 15.227L20 18.9393L23.7123 15.227C24.0052 14.9341 24.48 14.9341 24.7729 15.227C25.0658 15.5199 25.0658 15.9948 24.7729 16.2877L21.0606 20L24.7729 23.7123C25.0658 24.0052 25.0658 24.48 24.7729 24.7729C24.48 25.0658 24.0052 25.0658 23.7123 24.7729L20 21.0606L16.2877 24.7729C15.9948 25.0658 15.5199 25.0658 15.227 24.7729C14.9341 24.48 14.9341 24.0052 15.227 23.7123L18.9393 20L15.227 16.2877C14.9341 15.9948 14.9341 15.5199 15.227 15.227Z"
                    fill="#C7C7CC" />
            </svg>
        </div>
        <div class="form-block">
            <h2>Join our User Council</h2>

            <form method="post" id="basic_form">
                <div class="input-items">
                <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response">
                    <input type="hidden" name="name-form" value="Join our User Council">
                    <div class=" input-item">
                        <input id="basic_name" type="text" class="name" name="name" placeholder="Your name *" />
                        <label for="">Your name <span>*</span></label>
                    </div>
                    <div class=" input-item">
                        <input id="basic_company" type="text" class="company" name="company"
                            placeholder="Your company MC *" />
                        <label for="">Your company MC <span>*</span></label>
                    </div>
                    <div class="input-item">
                        <input id="basic_email" type="email" name="email" placeholder="You work email *">
                        <label for="basic_email">You work email <span>*</span></label>
                    </div>
                    <div class="input-item select">
                        <div class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="6"
                                viewBox="0 0 11 6" fill="none">
                                <path d="M1 1L5.24264 5.24264L9.48528 1" stroke="#8E8E93" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg></div>
                        <select class="select" id="select" name="position" id="position">
                            <option value="" selected>Select position</option>
                            <option value="Company driver">Company driver</option>
                            <option value="Leased-on owner-operator">Leased-on owner-operator</option>
                            <option value="Owner operator working under own authority">Owner operator working under own
                                authority</option>
                            <option value="Company dispatcher">Company dispatcher</option>
                            <option value="Dispatcher from the dispatch agency">Dispatcher from the dispatch agency
                            </option>
                            <option value="Fleet manager">Fleet manager </option>
                            <option value="Company owner">Company owner</option>

                        </select>
                        <label for="position">Which position best describes you? <span>*</span></label>
                    </div>
                    <div class="input-item">

                        <textarea name="comment" id="comment" placeholder="Message"></textarea>
                        <label for="comment">Message</label>
                    </div>

                    <button class="form-button" type=" submit">Submit</button>
                </div>
            </form>
        </div>
        <div class="success">
            <h3>Welcome aboard!</h3>
            <p> We’re reviewing your submission and will reach out shortly with next steps.</p>
        </div>
        <div class="invalid">Error sending message. Please try again later.</div>
        <div class="popup-bottom">
            <div class="logo"><img src="<?php echo get_template_directory_uri() ?>/assets/images/logo-popup.svg" />
            </div>
            <p>By submitting this form I agree that LBOARD may collect, process and retain my data in accordance
                with its <a href="/privacy-policy/">Privacy Policy.</a>
            </p>
        </div>



    </div>
</div>