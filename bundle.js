(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.GithubIssueForm = function (options) {
    this.token = options.token;
    this.repository = options.repository;
    this.useragent = options.useragent || 'portable-github-issues-form';
    this.assignee = options.assignee || null; //GitHub usernames of assigned users.
    this.labels = options.labels || ['bug'];
    this.milestone = options.milestone || null; // Number
    this.DOMElement = null;
    this.html_url = null;
    var issue = this;
    if (!issue.token) {
        throw new Error('Error : Missing authentification token.');
    }
    if (!issue.repository) {
        throw new Error('Missing repository.');
    }
    function send(title, content) {
        // Basic validation:
        if (!title || !content) {
            var feedback = 'Please answer all questions before submitting your feedback.';
            alert(feedback);
            throw new Error(feedback);
        }
        var endPoint = 'https://api.github.com/repos/' + issue.repository + '/issues';
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // Process our return data
            if (xhr.status >= 200 && xhr.status < 300) {
                // Successful request
                var response = JSON.parse(xhr.response);
                console.info(response.html_url, 'redirect url 2');
                issue.html_url = response.html_url;
                issue.DOMElement.reset();
                var ask = window.confirm("Thank you for your feedback!");
                if (ask) {
                    window.location.href = response.html_url;
                }
            } else {
                console.error('The request failed!');
            }
        };
        // Create and send the POST request
        xhr.open('POST', endPoint, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "token " + issue.token);

        var data = {
            'title': title,
            'body': content,
            'useragent': issue.useragent,
            'labels': issue.labels
        }
        if ('' !== issue.assignee) {
            data.assignee = issue.assignee;
        }
        if ('' !== issue.milestone) {
            data.milestone = issue.milestone;
        }
        console.info(data, 'data sent:');
        xhr.send(JSON.stringify(data));
    };

    this.form = ['<div id="js-github-issues-form" class="portable-github-form">',
        '<input id="open-item" name="js-githubform-trigger" type="radio" />',
        '<input id="close-item" name="js-githubform-trigger" type="radio" checked="checked" />',
        '    <label for="open-item" class="open">Submit Feedback</label>',
        '<section>',
        '<label for="close-item" class="close">&times;</label>',
        '<span class="title">Submit Feedback</span>',
        '<div class="wrap">',
        '<p class="info">Found a bug or want to leave feedback?</p>',
        '<p class="info">Please use this form to leave feedback about specific features or behaviours. (<a href="//github.com/' + this.repository + '/issues" target="_blank">See pending issues</a>)</p>',
        '<form id="js-github-form">',
        '<div><label for="git-name">Name</label><input type="text" id="git-name" name="name" placeholder="Your name"></div>',
        '<div><label for="git-email">Email</label><input type="email" id="git-email" name="email" placeholder="Your email address"></div>',
        '<div><label for="git-title">Title</label><input type="text" id="git-title" name="title" placeholder="Describe your feedback in a few words"></div>',
        '<div><label for="git-content">Feedback</label><textarea id="git-content" name="content" placeholder="If reporting a bug, please describe steps to reproduce the issue, include any error messages."></textarea>',
        '</div><div><input tabindex="2" type="submit" name="send" id="js-github-issues-form-send" class="github-issues-form-send" value="Submit"></div>',
        '</form>',
        '</div></section></div>'].join('\n');
    this.addStyle = function () {
        // see scss file for a human-friendly version of the css code.
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '.portable-github-form{position:fixed;bottom:-33px;right:0;z-index:9999;width:22rem;height:auto;max-width:80%;padding:1.5rem;margin:2rem;font-family:sans-serif;font-size:1rem}.portable-github-form input[type=radio]{display:none}.portable-github-form label.close,.portable-github-form label.open{text-align:center;position:absolute}.portable-github-form label.open{font-size:11px;color:#222;background:#fff;width:100px;bottom:-50px;left:0;right:0;top:auto;margin:0 auto;padding:10px 0;text-transform:uppercase;z-index:1;font-weight:600;box-shadow:2px 4px 56px -6px rgba(0,0,0,.80)}.portable-github-form input#close-item:checked~label.open{-webkit-transition:bottom .3s ease .4s,background .1s ease,color .1s ease;-moz-transition:bottom .3s ease .4s,background .1s ease,color .1s ease;-ms-transition:bottom .3s ease .4s,background .1s ease,color .1s ease;-o-transition:bottom .3s ease .4s,background .1s ease,color .1s ease;transition:bottom .3s ease .4s,background .1s ease,color .1s ease;bottom:0}.portable-github-form label.open:focus,.portable-github-form label.open:hover{background:#222;color:#fff}.portable-github-form label.close{right:0;left:auto;top:0;bottom:auto;font-size:20px;background:#333;color:#fff;width:22px}.portable-github-form label.close:focus,.portable-github-form label.close:hover{background:#757786}.portable-github-form .wrap{padding:1rem}.portable-github-form section{margin:0;overflow:hidden;width:100%;height:auto;right:0;bottom:0;position:absolute;z-index:10;background:#fff;box-shadow:2px 4px 56px -6px rgba(0,0,0,.27);-webkit-backface-visibility:hidden;transition:all .4s cubic-bezier(.2,.6,.3,1)}.portable-github-form span.title{font-size:24px;padding:30px;color:#fff;background:#333;text-transform:uppercase;display:block;width:100%;font-weight:100}.portable-github-form p.info{font-size:13px;color:#999;line-height:18px}.portable-github-form input#close-item:checked~section,.portable-github-form section{transform:translateY(100%)}.portable-github-form input#open-item:checked~section{transform:translateY(0)}.portable-github-form fieldset{border:1px solid #DDD;padding:2rem}.portable-github-form legend{background:#fff;padding-right:1rem;display:block;margin-left:0}.portable-github-form div{margin:0 auto 1rem}.portable-github-form label{display:inline-block;margin-bottom:0.5rem}.portable-github-form input,.portable-github-form textarea{display:block;width:21rem;font-family: Verdana,Geneva,sans-serif;padding: .375rem .75rem;font-size: 1rem;font-weight: 400;line-height: 1.5;color: #495057;background-color: #fff;background-clip: padding-box;border: 1px solid #ced4da;border-radius: .25rem;}.portable-github-form textarea{min-height:6rem}.portable-github-form input.github-issues-form-send{display: block;margin:2rem auto;font-weight: 400;color: #fff;text-align: center;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-color: transparent;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;line-height: 1.5;border-radius: .25rem;background-color: #007bff;border-color: #007bff;}';
        document.head.appendChild(css);
    }

    this.inject = function () {
        window.onload = function () {
            /** 
             * - Inject the HTML form into the document
             * - autohide it
             * - Bind the Events 
             * */

            document.querySelector('body').insertAdjacentHTML("beforeend", issue.form);
            issue.addStyle();
            //var wrapper = document.getElementById('js-github-issues-form');
            issue.DOMElement = document.getElementById('js-github-form');
            // bind Submit event
            issue.DOMElement.addEventListener("submit", function (e) {
                e.preventDefault();
                var title = document.getElementById('git-title').value;
                var body = '<b>Name: </b>' + document.getElementById('git-name').value + '<br />';
                body += '<b>Email: </b>' + document.getElementById('git-email').value + '<br /><br />';
                body += document.getElementById('git-content').value;
                send(title, body);
            });
        };
    }
};
},{}]},{},[1]);
