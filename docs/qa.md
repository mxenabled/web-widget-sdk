# QA

Below you will find instructions on how to test the MX Web Widget SDK. This
document is broken up into a section that outlines what is needed for the full
test suite, and another section that outlines what is needed for no-harm test
suite.

## Prerequisites

- Tests should be ran in the [browsers
  supported](https://docs.mx.com/connect#browser-support) by our widgets.
- The Web Widget SDK can be used with all of our widgets, but the primary one
  is the Connect widget, so the Connect widget should be used in the following
  tests.
- Tests should be ran using the example application that is included in the Web
  Widget SDK repo. Run `npm run example` to build the SDK (if needed) and start
  the example application. Refer to [this document](./../example/README.md) for
  additional information on how to setup and configure the example application,
  and [this document][sso_api_proxy_config] for how to configure the
  `mx-sso-api-proxy-rc.yaml` file for the proxy server that powers the example
  application.
- Before testing an update, make sure to pull the latest changes and clean up
  the current build:
  ```bash
  git checkout .          # Reset all local changes
  git pull origin master  # Pull latest updates
  npm install             # Install latest versions of all dependencies
  npm run clean           # Delete previous build
  npm run example         # Start the example application
  ```


## Full test suite

- **Loading Connect**: there are two ways of loading a widget in the SDK: using
  a proxy server and using a hard-coded URL. Both methods can be used in the
  example application, they simply require that you modify the
  `example/index.html` file with the appropriate changes:
    - **Using a proxy server**: you will need to set `proxy` in the `options`
    object (and remove `url` if set) to a value of `/user/widget_urls` and run
    the SSO proxy server by running `npm run example`.
    - **Using a hard-coded URL**: you will need to set `url` in the `options`
    object (and remove `proxy` if set) to a widget SSO URL.
- **Post message integration**: when you load the application, ensure
  that you see the post messages in the side panel.
- **Connect an institution**: ensure that you are able to connect and aggregate
  any institution.
- **OAuth**
    - **New member flow**: for this test you will need a user that has not
    previously connected to an institution that uses OAuth. You can delete
    existing members to get to this "new member" state. Sign in to the
    institution and ensure the following:
        - **Authorize flow**
            - After you click the Sign In button in Connect, ensure a new
            browser window opens and you are prompted to authorize or deny
            access.
            - When you click authorize, ensure you are redirected to the
            application.
            - After landing back in the demo application, ensure that Connect
            is able to successfully connect the new member.
        - **Deny flow**
            - After you click the Sign In button in Connect, ensure a new
            browser window opens and you are prompted to authorize or deny
            access.
            - When you click deny, ensure you are redirected to the
            application.
            - After landing back in the demo application, ensure that Connect
            shows you an error message.
    - **Existing member flow**: for this test you will need a user that has
    previously connected to an institution that uses OAuth. You can connect to
    institution twice to get to this "existing member" state. Sign in to the
    institution and ensure the following:
        - **Authorize flow**: ensure this works the same the Authorize flow
        under the New member flow. The only difference is that you will have to
        confirm that you have already connected to that institution and would
        like to continue.
        - **Deny flow**: ensure this works the same the Deny flow under the New
        member flow. The only difference is that you will have to confirm that
        you have already connected to that institution and would like to
        continue.

## No-harm test suite

We should run through the following tests (which are outlined in the section
above) when doing no-harm testing:

- **Loading Connect**: use the proxy method of loading a widget. See section
  above for instructions.
- **Post message integration**: see section above for instructions.
- **OAuth**: we should test both the new member flow and the existing member
  flow. See section above for instructions.


[sso_api_proxy_config]: https://github.com/mxenabled/sso-api-proxy#configuration "Configuration"
