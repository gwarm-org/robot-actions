const dotenv = require("dotenv");
dotenv.config();
/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./apps/robots/robot-actions/src/app/app.module.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AppModule = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const rabbitmq_1 = __webpack_require__(
        "./libs/packages/rabbitmq/src/index.ts"
      );
      const gmail_1 = __webpack_require__("./libs/robot/gmail/src/index.ts");
      const hotmail_1 = __webpack_require__(
        "./libs/robot/hotmail/src/index.ts"
      );
      const common_1 = __webpack_require__("@nestjs/common");
      const script_module_1 = __webpack_require__(
        "./apps/robots/robot-actions/src/app/script/script.module.ts"
      );
      const proton_1 = __webpack_require__("./libs/robot/proton/src/index.ts");
      let AppModule = class AppModule {};
      AppModule = tslib_1.__decorate(
        [
          (0, common_1.Module)({
            imports: [
              script_module_1.ScriptModule.registerAsync([
                gmail_1.Gmail,
                hotmail_1.Hotmail,
                proton_1.Proton,
              ]),
              rabbitmq_1.RabbitMQModule.forRootAsync({
                uri: process.env.RABBITMQ_URI,
                tasks: [],
              }),
            ],
            controllers: [],
            providers: [],
          }),
        ],
        AppModule
      );
      exports.AppModule = AppModule;

      /***/
    },

    /***/ "./apps/robots/robot-actions/src/app/script/script.module.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var ScriptModule_1;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ScriptModule = exports.APPLICATION_PROVIDER = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
      const common_1 = __webpack_require__("@nestjs/common");
      const logger = new common_1.Logger("ISP");
      exports.APPLICATION_PROVIDER = "SCRIPT_APPLICATION";
      let ScriptModule = (ScriptModule_1 = class ScriptModule {
        static registerAsync(isps) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const application = new core_1.Application();
            yield application.openBrowser(true);
            for (const isp of isps) {
              const i = new isp();
              application.registerIsp(i);
              logger.log(`${i.name.toUpperCase()} is ready !`);
            }
            return {
              module: ScriptModule_1,
              providers: [
                {
                  provide: exports.APPLICATION_PROVIDER,
                  useValue: application,
                },
              ],
              exports: [exports.APPLICATION_PROVIDER],
            };
          });
        }
        onApplicationShutdown(signal) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logger.log(`Application shutdown with ${signal}`);
          });
        }
      });
      ScriptModule = ScriptModule_1 = tslib_1.__decorate(
        [
          (0, common_1.Global)(),
          (0, common_1.Module)({
            imports: [],
            controllers: [],
            providers: [],
          }),
        ],
        ScriptModule
      );
      exports.ScriptModule = ScriptModule;

      /***/
    },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/auth-handler2.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GmailAuthHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const handler_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/index.ts"
        );
        const service_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/service/index.ts"
        );
        class GmailAuthHandler extends core_1.AuthHandler {
          handle(context, email, payload, result) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              const routingService = new service_1.RoutingService(page);
              const handlerService = new service_1.HandlerService();
              handlerService.signHandler(
                new handler_1.EmailHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.EmailWrongHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.PasswordHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.PasswordWrongHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.ChallengeHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.ConfirmationEmailHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.ConfirmationEmailWrongHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.PhoneHandler(page, email)
              );
              handlerService.signHandler(
                new handler_1.DisabledAccountHandler(page, email)
              );
              handlerService.signHandler(new handler_1.EndHandler(page, email));
              const authService = new service_1.AuthService(
                page,
                routingService,
                handlerService
              );
              const content = yield authService.Authenticate(email);
              if (content.isFail) {
                result.error = content.error;
                throw new Error(content.error);
              }
              const token = yield authService.getResult(context);
              result.token = token.token;
              result.error = token.error;
              return result;
            });
          }
        }
        exports.GmailAuthHandler = GmailAuthHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/challenge.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ChallengeHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class ChallengeHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.CHALLENGE_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = this.page.locator('div[data-challengetype="12"]');
              if ((yield locator.count()) == 0)
                return (0, shared_1.fail)("Email challenge not found");
              const available = yield locator
                .nth(0)
                .getAttribute("data-challengeunavailable");
              if (
                (available === null || available === void 0
                  ? void 0
                  : available.toString()) == "true"
              ) {
                return (0, shared_1.fail)(
                  "Confirmation by email is temporary unavailable"
                );
              }
              locator.nth(0).click();
              return (0, shared_1.success)(false);
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const payload = res.request().postData();
              if (payload) {
                return payload.includes(
                  '1,\\"accounts.google.com/signin/v2/challenge/selection'
                );
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  "[data-challengetype] >> visible=true",
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("Challenges not Found!");
              } catch (e) {
                console.log(e);
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.ChallengeHandler = ChallengeHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/confirmation-email-wrong.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ConfirmationEmailWrongHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class ConfirmationEmailWrongHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name =
              handler_enum_1.HandlerEnum.CONFIRMATION_EMAIL_WRONG_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("Confirmation Email is wrong");
              return (0, shared_1.fail)("Confirmation Email is wrong");
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              if (res.url().includes("signin/challenge")) {
                const body = (yield res.text()).toLowerCase();
                if (
                  body.includes(this.email.email.toLowerCase()) &&
                  body.includes(
                    "INCORRECT_ANSWER_ENTERED".toLocaleLowerCase()
                  ) &&
                  body.includes("LOGIN_CHALLENGE".toLocaleLowerCase())
                ) {
                  return true;
                }
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[type="email"] >> visible=true',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("Confirmation Input not Found!");
              } catch (e) {
                console.log(e);
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.ConfirmationEmailWrongHandler = ConfirmationEmailWrongHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/confirmation-email.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ConfirmationEmailHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class ConfirmationEmailHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.CONFIRMATION_EMAIL_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = this.page.locator(
                'input[type="email"] >> visible=true'
              );
              if ((yield locator.count()) == 0)
                return (0, shared_1.fail)("input Email challenge not found");
              yield locator.nth(0).type(this.email.confirmationEmail);
              return (0, shared_1.success)(true);
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const payload = res.request().postData();
              if (payload) {
                return payload.includes("signin/v2/challenge/kpe");
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[type="email"] >> visible=true',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("Input not Found!");
              } catch (e) {
                console.log(e);
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.ConfirmationEmailHandler = ConfirmationEmailHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/disabled-account.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.DisabledAccountHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class DisabledAccountHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.DISABLED_ACCOUNT_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              return (0, shared_1.fail)("Account is disabled");
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const payload = res.request().postData();
              if (payload) {
                return payload.includes("signin/v2/disabled/explanation");
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  '[data-is-secondary-action-disabled="false"] >> visible=true',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("Section is not found");
              } catch (e) {
                console.log(e);
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.DisabledAccountHandler = DisabledAccountHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/email-wrong.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.EmailWrongHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class EmailWrongHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.EMAIL_WRONG_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              return (0, shared_1.fail)("Email is wrong");
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              if (res.url().includes("lookup/accountlookup")) {
                const body = yield res.text();
                if (
                  !body.toLowerCase().includes(this.email.email.toLowerCase())
                ) {
                  return true;
                }
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[type="email"]',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("Email input not found");
              } catch (e) {
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.EmailWrongHandler = EmailWrongHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/email.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.EmailHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const util_1 = __webpack_require__("util");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        const sleep = (0, util_1.promisify)(setTimeout);
        class EmailHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.EMAIL_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = yield this.page.locator('input[type="email"]');
              if ((yield locator.count()) == 0)
                return (0, shared_1.fail)("Email input not found");
              yield locator.nth(0).type(this.email.email);
              return (0, shared_1.success)(true);
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const payload = res.request().postData();
              if (payload) {
                return payload.includes(
                  "accounts.google.com/v3/signin/identifier"
                );
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[type="email"]',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("Email input not found");
              } catch (e) {
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.EmailHandler = EmailHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/end.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.EndHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class EndHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.END;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              return (0, shared_1.success)(false);
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              return res.url().includes("https://mail.google.com/mail/u/0/");
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  "[data-legacy-last-message-id] >> visible=true",
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)('role="tabpanel"');
              } catch (e) {
                console.log(e);
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.EndHandler = EndHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts":
      /***/ (__unused_webpack_module, exports) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.HandlerEnum = void 0;
        var HandlerEnum;
        (function (HandlerEnum) {
          HandlerEnum["EMAIL_HANDLER"] = "EMAIL_HANDLER";
          HandlerEnum["EMAIL_WRONG_HANDLER"] = "EMAIL_WRONG_HANDLER";
          HandlerEnum["PASSWORD_HANDLER"] = "PASSWORD_HANDLER";
          HandlerEnum["PASSWORD_WRONG_HANDLER"] = "PASSWORD_WRONG_HANDLER";
          HandlerEnum["CONFIRMATION_EMAIL_HANDLER"] =
            "CONFIRMATION_EMAIL_HANDLER";
          HandlerEnum["CONFIRMATION_EMAIL_WRONG_HANDLER"] =
            "CONFIRMATION_EMAIL_WRONG_HANDLER";
          HandlerEnum["LOGGED_IN_HANDLER"] = "LOGGED_IN_HANDLER";
          HandlerEnum["CHALLENGE_HANDLER"] = "CHALLENGE_HANDLER";
          HandlerEnum["PHONE_HANDLER"] = "PHONE_HANDLER";
          HandlerEnum["CHANGE_PASSWORD_HANDLER"] = "CHANGE_PASSWORD_HANDLER";
          HandlerEnum["DISABLED_ACCOUNT_HANDLER"] = "DISABLED_ACCOUNT_HANDLER";
          HandlerEnum["END"] = "END";
          HandlerEnum["TIMEOUT"] = "TIMEOUT";
        })((HandlerEnum = exports.HandlerEnum || (exports.HandlerEnum = {})));

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/index.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.HANDLERS = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const email_wrong_handler_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/email-wrong.handler.ts"
        );
        const email_handler_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/email.handler.ts"
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/email.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/email-wrong.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/password.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/passowrd-wrong.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/challenge.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/confirmation-email.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/confirmation-email-wrong.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/phone.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/disabled-account.handler.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/handler/end.handler.ts"
          ),
          exports
        );
        exports.HANDLERS = [
          email_handler_1.EmailHandler,
          email_wrong_handler_1.EmailWrongHandler,
        ];

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/passowrd-wrong.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.PasswordWrongHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class PasswordWrongHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.PASSWORD_WRONG_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              return (0, shared_1.fail)("Password is wrong");
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              if (res.url().includes("pwd")) {
                const body = yield res.text();
                if (
                  body
                    .toLowerCase()
                    .includes("INCORRECT_ANSWER_ENTERED".toLowerCase()) &&
                  body.toLowerCase().includes("FIRST_AUTH_FACTOR".toLowerCase())
                ) {
                  return true;
                }
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[type="password"] >> visible=true',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("password input not found");
              } catch (e) {
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.PasswordWrongHandler = PasswordWrongHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/password.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.PasswordHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class PasswordHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.PASSWORD_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = this.page.locator('input[type="password"]');
              if ((yield locator.count()) == 0)
                return (0, shared_1.fail)("password input not found");
              yield this.page.waitForTimeout(1000);
              yield locator.nth(0).type(this.email.password);
              return (0, shared_1.success)(true);
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              if (res.url().includes("pwd")) {
                const body = yield res.text();
                if (
                  body.toLowerCase().includes("INITIALIZED".toLowerCase()) &&
                  body.toLowerCase().includes("FIRST_AUTH_FACTOR".toLowerCase())
                ) {
                  return true;
                }
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[type="password"] >> visible=true',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("password input not found");
              } catch (e) {
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.PasswordHandler = PasswordHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/handler/phone.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.PhoneHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        const model_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts"
        );
        const handler_enum_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/handler.enum.ts"
        );
        class PhoneHandler extends model_1.Handler {
          constructor() {
            super(...arguments);
            this.name = handler_enum_1.HandlerEnum.PHONE_HANDLER;
          }
          handle() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              return (0, shared_1.fail)("Phone number is required");
            });
          }
          waitFor(res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              if (
                res.url().includes("challenge") &&
                !res.url().includes("password")
              ) {
                const value = yield res.headerValue("google-accounts-signin");
                const body = yield res.text();
                if (
                  !value &&
                  body.includes("speedbump/idvreenable") &&
                  !body
                    .toLocaleLowerCase()
                    .includes(this.email.email.toLocaleLowerCase()) &&
                  !body
                    .toLocaleLowerCase()
                    .includes("LOGIN_CHALLENGE".toLocaleLowerCase()) &&
                  !body
                    .toLocaleLowerCase()
                    .includes("INCORRECT_ANSWER_ENTERED".toLocaleLowerCase())
                )
                  return true;
              }
              return false;
            });
          }
          validate() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              try {
                const input = yield this.page.waitForSelector(
                  'input[name="deviceAddress"] >> visible=true',
                  {
                    timeout: 5000,
                  }
                );
                if (input) return (0, shared_1.success)(true);
                else return (0, shared_1.fail)("input not found");
              } catch (e) {
                return (0, shared_1.fail)(e.message);
              }
            });
          }
        }
        exports.PhoneHandler = PhoneHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/auth-handler2.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/model/handler.ts":
      /***/ (__unused_webpack_module, exports) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Handler = void 0;
        class Handler {
          constructor(page, email) {
            this.page = page;
            this.email = email;
          }
        }
        exports.Handler = Handler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/model/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/model/handler.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/service/auth.service.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.AuthService = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__(
          "./libs/views/shared/src/index.ts"
        );
        const handler_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/index.ts"
        );
        const shared_2 = __webpack_require__("./libs/shared/src/index.ts");
        const zlib_1 = __webpack_require__("zlib");
        const util_1 = __webpack_require__("util");
        const sleep = (0, util_1.promisify)(setTimeout);
        class AuthService {
          constructor(page, RoutingService, handlerService) {
            this.page = page;
            this.RoutingService = RoutingService;
            this.handlerService = handlerService;
          }
          Authenticate(email) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              yield this.page.goto(
                "https://accounts.google.com/AccountChooser/signinchooser?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&flowName=GlifWebSignIn&flowEntry=AccountChooser&hl=en",
                {
                  waitUntil: "commit",
                }
              );
              const loop = true;
              while (loop) {
                console.log("Next Loop!");
                const HANDLER_NAME_RESULT =
                  yield this.RoutingService.waitForNextHandler(
                    this.handlerService.getHandlers()
                  );
                if (HANDLER_NAME_RESULT.isFail) {
                  return (0, shared_2.fail)(
                    "Error : No Handler is created Yet"
                  );
                }
                const HANDLER_NAME = HANDLER_NAME_RESULT.value;
                console.log("Handler :", HANDLER_NAME);
                if (HANDLER_NAME === handler_1.HandlerEnum.END) {
                  return (0, shared_2.success)("Authenticated successfully");
                } else if (HANDLER_NAME === handler_1.HandlerEnum.TIMEOUT) {
                  return (0, shared_2.fail)("Timeout");
                } else {
                  const handler = this.handlerService.getHandler(HANDLER_NAME);
                  if (handler.isFail) return (0, shared_2.fail)(handler.error);
                  else {
                    const validationResult = yield handler.value.validate();
                    if (validationResult.isFail)
                      return (0, shared_2.fail)(
                        `Handler ${HANDLER_NAME} is Wrong`
                      );
                    const result = yield handler.value.handle();
                    if (result.isFail) return (0, shared_2.fail)(result.error);
                    if (result.value) {
                      const resultNext = yield this.clickNext();
                      if (resultNext.isFail)
                        return (0, shared_2.success)(
                          "Authenticated successfully"
                        );
                    }
                  }
                }
              }
              return (0, shared_2.success)("Authenticated successfully");
            });
          }
          clickNext() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = yield this.page.locator("text=Next");
              if ((yield locator.count()) == 0)
                return (0, shared_2.fail)("Next button not found");
              locator.nth(0).click();
              return (0, shared_2.success)("Clicked next");
            });
          }
          getResult(context) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const result = new shared_1.AuthResult();
              const deflated = (0, zlib_1.deflateSync)(
                JSON.stringify(JSON.stringify(yield context.storageState()))
              ).toString("base64");
              result.token = deflated;
              return result;
            });
          }
        }
        exports.AuthService = AuthService;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/service/handler.service.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.HandlerService = void 0;
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        class HandlerService {
          constructor() {
            this.handlers = new Map();
          }
          signHandler(handler) {
            this.handlers.set(handler.name, handler);
          }
          getHandler(target) {
            const handler = this.handlers.get(target);
            if (handler) return (0, shared_1.success)(handler);
            else return (0, shared_1.fail)("handler not found");
          }
          getHandlers() {
            return this.handlers;
          }
        }
        exports.HandlerService = HandlerService;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/service/index.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        const tslib_1 = __webpack_require__("tslib");
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/service/auth.service.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/service/handler.service.ts"
          ),
          exports
        );
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-auth-handler/src/service/routing.service.ts"
          ),
          exports
        );

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-auth-handler/src/service/routing.service.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.RoutingService = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const handler_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-auth-handler/src/handler/index.ts"
        );
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        class RoutingService {
          constructor(page) {
            this.page = page;
            this.passedHandlers = [];
          }
          waitForNextHandler(handlers) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const promotedHandlers = [];
              let response;
              try {
                response = yield this.page.waitForResponse(
                  (res) =>
                    tslib_1.__awaiter(this, void 0, void 0, function* () {
                      for (const handler of handlers) {
                        if (
                          (yield handler[1].waitFor(res)) &&
                          !this.passedHandlers.includes(handler[1])
                        ) {
                          this.passedHandlers.push(handler[1]);
                          return true;
                        }
                      }
                      return false;
                    }),
                  {
                    timeout: 15000,
                  }
                );
              } catch (e) {
                return (0, shared_1.fail)("Timeout waiting for next handler");
              }
              for (const handler of handlers) {
                if (yield handler[1].waitFor(response)) {
                  return (0, shared_1.success)(handler[0]);
                }
              }
              return (0, shared_1.success)(handler_1.HandlerEnum.TIMEOUT);
            });
          }
        }
        exports.RoutingService = RoutingService;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-change-name-handler/src/index.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        const tslib_1 = __webpack_require__("tslib");
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-change-name-handler/src/lib/change-name-handler.ts"
          ),
          exports
        );

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-change-name-handler/src/lib/change-name-handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GmailChangeNameHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const shared_1 = __webpack_require__(
          "./libs/views/shared/src/index.ts"
        );
        class GmailChangeNameHandler extends core_1.ChangeNameHandler {
          constructor() {
            super(...arguments);
            this.name = shared_1.TaskEnum.CHANGE_NAME;
          }
          handle(context, email, payload, result) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              console.log("[CHANGE_NAME] start");
              yield page.goto(
                "https://mail.google.com/mail/u/0/?tab=rm&ogbl#settings/accounts"
              );
              console.log("[CHANGE_NAME] go to accounts");
              yield this.waitForReady(page);
              const oldName = yield this.getCurrentName(page);
              console.time("[CHANGE_NAME] Delete Old Alias");
              yield this.deleteOldAlias(page);
              console.timeEnd("[CHANGE_NAME] Delete Old Alias");
              yield page.waitForTimeout(2000);
              console.time("[CHANGE_NAME] Add New Alias");
              yield this.addNewAlias(context, email, payload);
              console.timeEnd("[CHANGE_NAME] Add New Alias");
              yield page.waitForTimeout(2000);
              console.time("[CHANGE_NAME] Make Last As Default");
              yield this.makeLastAsDefault(page);
              console.timeEnd("[CHANGE_NAME] Make Last As Default");
              const newName = yield this.getCurrentName(page);
              result.name = newName;
              result.oldName = oldName;
              return result;
            });
          }
          addNewAlias(context, email, payload) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              const locators = yield page.locator(
                'tr > td > span[role="link"][idlink][tabindex="0"]'
              );
              yield locators.nth(0).click();
              console.log("click 'add new alias'");
              yield page.waitForTimeout(2000);
              console.log(context.pages().length);
              const newpage = context.pages().pop();
              if (!newpage) throw new Error("can't access add alias page");
              yield page.waitForTimeout(2000);
              const inputName = yield newpage.locator("#cfn");
              yield inputName.nth(0).click({ clickCount: 3 });
              yield inputName.nth(0).type(payload.name);
              const inputEmail = yield newpage.locator("#focus");
              const alias = this.createNewAliasEmail(email, payload);
              yield inputEmail.nth(0).type(alias);
              yield newpage.click('input[type="submit"] >> visible=true');
            });
          }
          createNewAliasEmail(
            { email },
            { withPlus, extension, numberOfPoints }
          ) {
            let username = email.split("@")[0].split(".").join("");
            const domaine = email.split("@")[1];
            const chunks = [];
            for (let i = 0; i < numberOfPoints; i++) {
              let x = 0;
              let count = 0;
              while (x <= 1 && x < username.length / 1.6 && count < 10) {
                x = Math.floor(Math.random() * username.length);
                count++;
              }
              const parts = username.substring(0, x);
              username = username.substring(x);
              chunks.push(parts);
            }
            chunks.push(username);
            let newusername = chunks.filter((x) => x != "").join(".");
            if (withPlus) {
              newusername += "+" + extension;
            }
            return newusername + "@" + domaine;
          }
          deleteOldAlias(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              let locators = page.locator(
                "tbody > tr:nth-child(2) > td:nth-child(4) > span"
              );
              console.log("old alias locators :", yield locators.count());
              while ((yield locators.count()) > 0) {
                yield locators.nth(0).click();
                yield page.waitForTimeout(2000);
                yield page.locator('button[name="ok"]').nth(0).click();
                yield page.waitForTimeout(1500);
                locators = page.locator(
                  "tbody > tr:nth-child(2) > td:nth-child(4)"
                );
              }
            });
          }
          makeLastAsDefault(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = yield page.locator(
                "tbody > tr:nth-child(2) > td:nth-child(2) > span[role]"
              );
              if ((yield locator.count()) == 0) {
                console.log("can't find last alias");
                return;
              }
              yield locator.nth(0).click();
              yield page.waitForTimeout(2000);
            });
          }
          waitForReady(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              yield page.waitForSelector("table > tbody input");
              console.log("browser is ready");
            });
          }
          getCurrentName(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const locator = page.locator(
                "tbody>tr:nth-child(4)>td:nth-child(2)>table:nth-child(1)>tbody>tr",
                {
                  has: page.locator("td:nth-child(4)"),
                }
              );
              const count = yield locator.count();
              switch (count) {
                case 0:
                  throw new Error("can't find current name");
                case 1:
                  return yield locator
                    .locator("td:first-child")
                    .nth(0)
                    .innerText();
                default:
                  return yield page
                    .locator(
                      "tbody>tr:nth-child(4)>td:nth-child(2)>table:nth-child(1)>tbody>tr",
                      {
                        has: page.locator("td:nth-child(2)>span:not([role])"),
                      }
                    )
                    .locator("td:first-child")
                    .nth(0)
                    .innerText();
              }
            });
          }
        }
        exports.GmailChangeNameHandler = GmailChangeNameHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-remove-devices-handler/src/index.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        const tslib_1 = __webpack_require__("tslib");
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/gmail/gmail-remove-devices-handler/src/remove-devices-handler.ts"
          ),
          exports
        );

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-remove-devices-handler/src/remove-devices-handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GmailRemoveDevicesHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const shared_1 = __webpack_require__(
          "./libs/views/shared/src/index.ts"
        );
        const util_1 = __webpack_require__("util");
        const sleep = (0, util_1.promisify)(setTimeout);
        class GmailRemoveDevicesHandler extends core_1.RemoveDeviceHandler {
          constructor() {
            super(...arguments);
            this.name = shared_1.TaskEnum.REMOVE_DEVICES;
          }
          handle(context, email, payload) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              yield page.goto(
                "https://myaccount.google.com/device-activity/?hl=en"
              );
              const locators = yield page.locator(
                "div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li a"
              );
              const ids = [];
              const count = yield locators.count();
              for (let i = 1; i < count; i++) {
                const id = yield locators.nth(i).getAttribute("data-device-id");
                ids.push(id);
              }
              for (const id of ids) {
                if (id) yield this.removeDevice(page, id);
              }
              return {};
            });
          }
          removeDevice(page, id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              yield page.goto(
                `https://myaccount.google.com/device-activity/id/${id}?hl=en`
              );
              const locator = page.locator('span:has-text("Sign") >> visible');
              console.log(yield locator.count());
              if ((yield locator.count()) > 0) {
                yield locator.nth(1).click();
                yield sleep(1500);
                const confirmlocator = page.locator(
                  'button:has-text("Sign") >> visible'
                );
                if ((yield confirmlocator.count()) > 0) {
                  yield confirmlocator.nth(1).click();
                }
              }
              yield sleep(1000);
            });
          }
        }
        exports.GmailRemoveDevicesHandler = GmailRemoveDevicesHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-reply-handler/src/handlers/filter.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.FilterHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        class FilterHandler {
          constructor(page) {
            this.page = page;
          }
          filter(filter) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("hello");
              yield this.page.goto(
                `https://mail.google.com/mail/u/0/#search/${filter}?hl=en`
              );
              yield this.page.waitForNavigation();
            });
          }
        }
        exports.FilterHandler = FilterHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-reply-handler/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/handlers/gmail/gmail-reply-handler/src/reply-handler.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/handlers/gmail/gmail-reply-handler/src/reply-handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GmailReplyHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const filter_handler_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-reply-handler/src/handlers/filter.handler.ts"
        );
        const message_service_1 = __webpack_require__(
          "./libs/handlers/gmail/gmail-reply-handler/src/services/message.service.ts"
        );
        class GmailReplyHandler extends core_1.ReplyHandler {
          handle(context, email, payload, res) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              res.count = 0;
              res.limited = false;
              res.blocked = false;
              res.bounce = 0;
              console.log("start reply");
              const page = context.pages()[0];
              const messageService = new message_service_1.MessageService(page);
              const filterHandler = new filter_handler_1.FilterHandler(page);
              console.log(res.count >= payload.limit);
              while (res.count < payload.limit) {
                yield filterHandler.filter(payload.filter);
                yield page.waitForNavigation();
                const messages = yield messageService.getMessages();
                if (messages.isFail) {
                  throw new Error("Couldn't get messages");
                }
                if (messages.value.messages.length === 0) break;
                for (const message of messages.value.messages) {
                  if (res.count >= payload.limit) break;
                  yield messageService.openMessage(message);
                  yield messageService.openReplyBox();
                  if (payload.reset) {
                    yield messageService.resetReplyBox();
                  }
                  yield messageService.SendMessage(payload.body);
                  res.count++;
                  console.log("message sent");
                }
              }
              return res;
            });
          }
        }
        exports.GmailReplyHandler = GmailReplyHandler;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-reply-handler/src/services/message.service.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.MessageService = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
        class MessageService {
          constructor(page) {
            this.page = page;
          }
          getMessages(date = -1) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.time("new function");
              const messages = yield this.page.evaluate((date) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const messages = [];
                const trs = document.querySelectorAll('tr[role="row"]');
                for (let i = 0; i < trs.length; i++) {
                  const tr = trs.item(i);
                  const box = tr.getBoundingClientRect();
                  if (box.width === 0 || box.height === 0) continue;
                  const fromContainer = tr.querySelector("span[email][name]");
                  const subjectContainer = tr.querySelector(
                    "span[data-thread-id]"
                  );
                  const dateContainer = tr.querySelector("span[title]");
                  const tooltipsContainer = tr.querySelectorAll(
                    'span[role="button"][data-tooltip]'
                  );
                  const classes = tr.getAttribute("class");
                  const message = {
                    from:
                      (_a =
                        fromContainer === null || fromContainer === void 0
                          ? void 0
                          : fromContainer.textContent) !== null && _a !== void 0
                        ? _a
                        : "",
                    email:
                      (_b =
                        fromContainer === null || fromContainer === void 0
                          ? void 0
                          : fromContainer.getAttribute("email")) !== null &&
                      _b !== void 0
                        ? _b
                        : "",
                    subject:
                      (_c =
                        subjectContainer === null || subjectContainer === void 0
                          ? void 0
                          : subjectContainer.textContent) !== null &&
                      _c !== void 0
                        ? _c
                        : "",
                    dataThreadId:
                      (_d =
                        subjectContainer === null || subjectContainer === void 0
                          ? void 0
                          : subjectContainer.getAttribute("data-thread-id")) !==
                        null && _d !== void 0
                        ? _d
                        : "",
                    date: Date.parse(
                      (_e =
                        dateContainer === null || dateContainer === void 0
                          ? void 0
                          : dateContainer.getAttribute("title")) !== null &&
                        _e !== void 0
                        ? _e
                        : ""
                    ),
                    id:
                      (_f =
                        subjectContainer === null || subjectContainer === void 0
                          ? void 0
                          : subjectContainer.getAttribute(
                              "data-legacy-last-message-id"
                            )) !== null && _f !== void 0
                        ? _f
                        : "",
                    isRead:
                      (_g = !(classes === null || classes === void 0
                        ? void 0
                        : classes.includes("zE"))) !== null && _g !== void 0
                        ? _g
                        : false,
                    isStarred: false,
                    isImportant: false,
                  };
                  for (let i = 0; i < tooltipsContainer.length; i++) {
                    const tooltip = tooltipsContainer.item(i);
                    const tooltipText = tooltip.getAttribute("aria-label");
                    switch (
                      tooltipText === null || tooltipText === void 0
                        ? void 0
                        : tooltipText.trim()
                    ) {
                      case "Not starred":
                        message.isStarred = false;
                        break;
                      case "Starred":
                        message.isStarred = true;
                        break;
                      case "Not important":
                        message.isImportant = false;
                        break;
                      case "Important":
                        message.isImportant = true;
                        break;
                    }
                  }
                  messages.push(message);
                }
                if (messages.length === 0)
                  return Promise.resolve({
                    messages: messages,
                    hasNext: false,
                  });
                const nextContainer = document.querySelectorAll(
                  'div[aria-label="Older"]'
                );
                let hasNext = !(
                  ((_h =
                    nextContainer === null || nextContainer === void 0
                      ? void 0
                      : nextContainer
                          .item(nextContainer.length - 1)
                          .getAttribute("aria-disabled")) === null ||
                  _h === void 0
                    ? void 0
                    : _h.toString()) === "true"
                );
                if (
                  hasNext &&
                  messages.length > 0 &&
                  messages[messages.length - 1].date < date
                ) {
                  hasNext = false;
                }
                return Promise.resolve({
                  messages: messages,
                  hasNext: hasNext,
                });
              }, date);
              console.timeEnd("new function");
              console.log(messages.hasNext, messages.messages.length);
              return (0, shared_1.success)(messages);
            });
          }
          openMessage(message) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("[REPLY] OPEN MESSAGE");
              const url = yield this.page.url();
              yield this.page.goto(url + "/" + message.id);
              yield this.page.waitForSelector(
                'tbody > tr:nth-child(1) > td:nth-child(4)> div:nth-child(1)[role="button"]'
              );
              console.log("[REPLY] OPEN MESSAGE DONE");
            });
          }
          openReplyBox() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("[REPLY] OPEN REPLY BOX");
              const locator = yield this.page.locator(
                'tbody > tr:nth-child(1) > td:nth-child(4)> div:nth-child(1)[role="button"]'
              );
              const count = yield locator.count();
              if (count > 0) {
                yield locator.nth(0).click();
              } else {
                throw new Error("[REPLY] Failed to find reply button");
              }
              yield this.page.waitForSelector(
                'div[data-tooltip="Show trimmed content"]'
              );
              yield this.page.waitForTimeout(2000);
            });
          }
          SendMessage(message) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("[REPLY] WRITE MESSAGE");
              const done = yield this.page.evaluate((msg) => {
                const context = document.querySelector(
                  'div[aria-label="Message Body"]'
                );
                if (context) {
                  context.innerHTML = msg;
                  return true;
                }
                return false;
              }, message);
              if (!done)
                return (0, shared_1.fail)("[REPLY] Failed to write message");
              yield this.page.waitForTimeout(2000);
              console.log("[REPLY] SEND MESSAGE");
              yield this.page.keyboard.down("Control");
              yield this.page.keyboard.press("Enter");
              yield this.page.keyboard.up("Control");
              yield this.page.waitForTimeout(1000);
              return (0, shared_1.success)(true);
            });
          }
          resetReplyBox() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("[REPLY] RESET REPLY BOX");
              const locator = this.page.locator(
                'div[data-tooltip="Show trimmed content"]'
              );
              const count = yield locator.count();
              if (count > 0) {
                yield locator.nth(0).click();
              } else {
                throw new Error("[REPLY] Failed to find reset button");
              }
              yield this.page.waitForTimeout(1000);
              console.log("[REPLY] REMOVE PREVIOUS MESSAGE");
              yield this.page.keyboard.down("Control");
              yield this.page.keyboard.press("A");
              yield this.page.keyboard.up("Control");
              yield this.page.keyboard.press("Backspace");
              console.log("[REPLY] RESET REPLY BOX DONE");
            });
          }
        }
        exports.MessageService = MessageService;

        /***/
      },

    /***/ "./libs/handlers/gmail/gmail-setup-rule-handler/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/handlers/gmail/gmail-setup-rule-handler/src/setup-rule.handler.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/handlers/gmail/gmail-setup-rule-handler/src/setup-rule.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GmailSetupRuleHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        class GmailSetupRuleHandler extends core_1.SetupRuleHandler {
          handle(context, email, payload, result) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              console.log("start");
              yield page.goto(
                "https://mail.google.com/mail/u/0/?tab=rm&hl=en&ogbl#settings/filters"
              );
              yield this.addInboxRule(page);
              yield this.addIgnoreRule(page);
              return result;
            });
          }
          addInboxRule(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("[SETUP RULE] OPEN SEARCH BOX");
              const locator = page.locator(
                'tr[role="listitem"] > td:first-child> span:first-child[role="link"][idlink]'
              );
              yield locator.nth(0).click();
              yield page.waitForTimeout(2000);
              console.log("[SETUP RULE] MARK 1 Byte as A Filter");
              yield page.type(
                "div > div:first-child > div:nth-child(2)>div:nth-child(6)>div:nth-child(3)>input",
                "1"
              );
              yield page.click(
                'div > div:first-child > div:nth-child(2)>div:nth-child(6)>div:nth-child(4) div[role="listbox"]'
              );
              yield page.click(
                'div > div:first-child > div:nth-child(2)>div:nth-child(6)>div:nth-child(4) div[role="listbox"] > div[role="option"]:nth-child(3)'
              );
              yield page.waitForTimeout(700);
              console.log("[SETUP RULE] CLICK CREATE FILTER");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(8)>div:nth-child(2)"
              );
              yield page.waitForTimeout(500);
              console.log("[SETUP RULE] CHECK MOVE TO INBOX");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(3)> div:first-child > div:nth-child(7)> label"
              );
              console.log("[SETUP RULE] CHECK MOVE TO PRIMARY");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(3)> div:first-child > div:nth-child(10)>div:nth-child(3)"
              );
              yield page.waitForTimeout(500);
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(3)> div:first-child > div:nth-child(10)>div:nth-child(4)>div:nth-child(2)"
              );
              yield page.waitForTimeout(500);
              console.log("[SETUP RULE] SAVE FILTER");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(4)> div:first-child"
              );
            });
          }
          addIgnoreRule(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("[SETUP RULE] OPEN SEARCH BOX");
              yield page.click(
                'tr[role="listitem"] > td:first-child> span:first-child[role="link"][idlink]'
              );
              console.log("[SETUP RULE] FILL FROM INPUT");
              yield page.type(
                "div > div:first-child > div:nth-child(2) > div:first-child > span:nth-child(2) > input",
                "mailer-daemon@googlemail.com"
              );
              console.log("[SETUP RULE] CLICK CREATE FILTER");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(8)>div:nth-child(2)"
              );
              console.log("[SETUP RULE] CHECK MARK AS READ");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(3)> div:first-child > div:nth-child(2) > label"
              );
              console.log("[SETUP RULE] SAVE FILTER");
              yield page.click(
                "div > div:first-child > div:nth-child(2)>div:nth-child(4)> div:first-child"
              );
              yield page.waitForTimeout(1000);
            });
          }
        }
        exports.GmailSetupRuleHandler = GmailSetupRuleHandler;

        /***/
      },

    /***/ "./libs/handlers/hotmail/hotmail-auth-handler/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/handlers/hotmail/hotmail-auth-handler/src/lib/auth-handler.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/handlers/hotmail/hotmail-auth-handler/src/lib/auth-handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.HotmailAuthHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const shared_1 = __webpack_require__(
          "./libs/views/shared/src/index.ts"
        );
        class HotmailAuthHandler extends core_1.AuthHandler {
          constructor() {
            super(...arguments);
            this.name = shared_1.TaskEnum.AUTHENTICATION;
          }
          handle(context, email, payload) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              yield this.goToLoginPage(page);
              yield this.fillEmail(page, email.email);
              yield this.fillPassword(page, email.password);
              yield page.waitForTimeout(7978988);
              return new shared_1.AuthResult();
            });
          }
          goToLoginPage(page) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              yield page.goto("https://login.live.com/login.srf");
            });
          }
          fillEmail(page, email) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              yield page.click('input[type="email"]');
              yield page.fill('input[type="email"]', email);
              yield page.click("text=Next");
              yield page.waitForEvent("framenavigated", () => {
                return true;
              });
              console.log("frame navigated");
            });
          }
          fillPassword(page, password) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              yield page.click('input[type="password"]');
              yield page.fill('input[type="password"]', password);
              yield page.click("text=Sign in");
              yield page.waitForResponse((res) => {
                console.log(res.status());
                return false;
              });
            });
          }
        }
        exports.HotmailAuthHandler = HotmailAuthHandler;

        /***/
      },

    /***/ "./libs/handlers/proton/proton-auth-handler/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/handlers/proton/proton-auth-handler/src/lib/auth-handler.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/handlers/proton/proton-auth-handler/src/lib/auth-handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ProtonAuthHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const shared_1 = __webpack_require__(
          "./libs/views/shared/src/index.ts"
        );
        const zlib_1 = __webpack_require__("zlib");
        class ProtonAuthHandler extends core_1.AuthHandler {
          constructor() {
            super(...arguments);
            this.name = shared_1.TaskEnum.AUTHENTICATION;
          }
          handle(context, email, payload, result) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              console.log("START LOGIN");
              const page = context.pages()[0];
              yield page.goto(
                "https://account.proton.me/login?language=en&product=mail"
              );
              yield page.waitForSelector('input[id="username"]');
              yield page.type('input[id="username"]', email.email);
              yield page.type('input[type="password"]', email.password);
              yield page.click('button[type="submit"]');
              yield page.waitForSelector(
                "body > div.app-root > div.flex.flex-row.flex-nowrap.h100 > div > div > div > div.sidebar.flex.flex-nowrap.flex-column.no-print.outline-none > div.flex-item-fluid.flex-nowrap.flex.flex-column.scroll-if-needed.pb1 > nav > div > ul > li:nth-child(1)"
              );
              console.log("Logged in");
              const deflated = (0, zlib_1.deflateSync)(
                JSON.stringify(JSON.stringify(yield context.storageState()))
              ).toString("base64");
              result.token = deflated;
              return result;
            });
          }
        }
        exports.ProtonAuthHandler = ProtonAuthHandler;

        /***/
      },

    /***/ "./libs/handlers/proton/proton-change-name-handler/src/index.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        const tslib_1 = __webpack_require__("tslib");
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/proton/proton-change-name-handler/src/lib/change-name-handler.ts"
          ),
          exports
        );

        /***/
      },

    /***/ "./libs/handlers/proton/proton-change-name-handler/src/lib/change-name-handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ProtonChangeNameHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        const shared_1 = __webpack_require__(
          "./libs/views/shared/src/index.ts"
        );
        class ProtonChangeNameHandler extends core_1.ChangeNameHandler {
          constructor() {
            super(...arguments);
            this.name = shared_1.TaskEnum.CHANGE_NAME;
          }
          handle(context, email, payload, result) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              console.log("[CHANGE_NAME] start");
              yield page.goto(
                "https://account.proton.me/u/0/mail/identity-addresses"
              );
              yield page.waitForSelector("#displayName");
              yield page.click("#displayName", {
                clickCount: 3,
              });
              yield page.type("#displayName", payload.name);
              yield page.click(
                "#name-signature > div > form > div:nth-child(2) > div.settings-layout-right > button"
              );
              yield page.waitForTimeout(3000);
              result.name;
              return result;
            });
          }
        }
        exports.ProtonChangeNameHandler = ProtonChangeNameHandler;

        /***/
      },

    /***/ "./libs/handlers/proton/proton-setup-rule-handler/src/index.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        const tslib_1 = __webpack_require__("tslib");
        tslib_1.__exportStar(
          __webpack_require__(
            "./libs/handlers/proton/proton-setup-rule-handler/src/setup-rule.handler.ts"
          ),
          exports
        );

        /***/
      },

    /***/ "./libs/handlers/proton/proton-setup-rule-handler/src/setup-rule.handler.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ProtonSetupRuleHandler = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
        class ProtonSetupRuleHandler extends core_1.SetupRuleHandler {
          handle(context, email, payload, result) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
              const page = context.pages()[0];
              console.log("start");
              yield page.goto("https://account.proton.me/u/0/mail/filters");
              yield page.click(
                "#custom > div > div > button.button.button-solid-norm.on-mobile-mb0-5.mr1"
              );
              yield page.waitForSelector("#name");
              yield page.type(
                "#name",
                Math.ceil(Math.random() * 10000).toString()
              );
              yield page.click(
                "body > div.modal-two > dialog > form > div.modal-two-footer > div > button"
              );
              yield page.waitForSelector("select");
              console.log("select option");
              yield page.selectOption("select", "sender");
              yield page.selectOption(
                "div > div:nth-child(1) > span:nth-child(2) > span > span > select",
                "!contains"
              );
              yield page.type(
                "div > div:nth-child(2) > div > div > span > input",
                "|||||||||||||||||||||||||||"
              );
              yield page.click("div > div:nth-child(2) > div > div > button");
              yield page.waitForTimeout(500);
              yield page.click(
                "dialog > form > div.modal-two-footer > div > button"
              );
              yield page.waitForSelector("#memberSelect");
              yield page.click("#memberSelect");
              yield page.waitForTimeout(500);
              yield page.click(
                "div.dropdown-content > ul > li:nth-child(5) > button"
              );
              yield page.waitForTimeout(500);
              yield page.click(
                "form > div.modal-two-footer > div > button.button.button-solid-norm"
              );
              yield page.waitForTimeout(2000);
              return result;
            });
          }
        }
        exports.ProtonSetupRuleHandler = ProtonSetupRuleHandler;

        /***/
      },

    /***/ "./libs/packages/rabbitmq/src/decorators/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/packages/rabbitmq/src/decorators/inject-channel.decorator.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/packages/rabbitmq/src/decorators/inject-channel.decorator.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.InjectChannel = void 0;
        const common_1 = __webpack_require__("@nestjs/common");
        const InjectChannel = () => (0, common_1.Inject)("RABBITMQ_CHANNEL");
        exports.InjectChannel = InjectChannel;

        /***/
      },

    /***/ "./libs/packages/rabbitmq/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/packages/rabbitmq/src/rabbitmq.module.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/packages/rabbitmq/src/interfaces/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/packages/rabbitmq/src/decorators/index.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/packages/rabbitmq/src/interfaces/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/packages/rabbitmq/src/interfaces/rabbitmq-module.option.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/packages/rabbitmq/src/interfaces/rabbitmq-module.option.ts":
      /***/ (__unused_webpack_module, exports) => {
        Object.defineProperty(exports, "__esModule", { value: true });

        /***/
      },

    /***/ "./libs/packages/rabbitmq/src/rabbitmq.module.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var RabbitMQModule_1;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RabbitMQModule = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const common_1 = __webpack_require__("@nestjs/common");
      const amqplib_1 = __webpack_require__("amqplib");
      let RabbitMQModule = (RabbitMQModule_1 = class RabbitMQModule {
        static forRootAsync(options) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
              connection = yield (0, amqplib_1.connect)(options.uri);
            } catch (e) {
              common_1.Logger.log("RabbitMQ connection closed :", e);
              process.exit(1);
            }
            const channel = yield connection.createChannel();
            common_1.Logger.log(
              `Connected to RabbitMQ server`,
              "RabbitMQModule"
            );
            const p = [];
            for (const task of options.tasks) {
              p.push(
                channel.assertQueue(task, {
                  durable: true,
                })
              );
            }
            p.push(
              channel.assertQueue("RESPONSE", {
                durable: true,
              })
            );
            p.push(
              channel.assertQueue("UNDO", {
                durable: true,
              })
            );
            yield Promise.all(p);
            common_1.Logger.log(`Asserted queues`, "RabbitMQModule");
            return {
              module: RabbitMQModule_1,
              imports: [],
              providers: [
                {
                  provide: "RABBITMQ_CHANNEL",
                  useValue: channel,
                },
              ],
              exports: ["RABBITMQ_CHANNEL"],
            };
          });
        }
        onModuleDestroy() {
          common_1.Logger.log("RabbitMQModule destroyed");
        }
        onApplicationShutdown() {
          common_1.Logger.log("RabbitMQModule shutdown");
        }
        beforeApplicationShutdown() {
          common_1.Logger.log("RabbitMQModule before shutdown");
        }
      });
      RabbitMQModule = RabbitMQModule_1 = tslib_1.__decorate(
        [
          (0, common_1.Global)(),
          (0, common_1.Module)({
            imports: [],
            providers: [],
            exports: [],
          }),
        ],
        RabbitMQModule
      );
      exports.RabbitMQModule = RabbitMQModule;

      /***/
    },

    /***/ "./libs/robot/core/src/controllers/auth.controller.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthController = void 0;
      const controller_1 = __webpack_require__(
        "./libs/robot/core/src/core/controller.ts"
      );
      class AuthController extends controller_1.Controller {}
      exports.AuthController = AuthController;

      /***/
    },

    /***/ "./libs/robot/core/src/controllers/change-name.controller.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameController = void 0;
      const controller_1 = __webpack_require__(
        "./libs/robot/core/src/core/controller.ts"
      );
      class ChangeNameController extends controller_1.Controller {}
      exports.ChangeNameController = ChangeNameController;

      /***/
    },

    /***/ "./libs/robot/core/src/controllers/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameController = exports.AuthController = void 0;
      var auth_controller_1 = __webpack_require__(
        "./libs/robot/core/src/controllers/auth.controller.ts"
      );
      Object.defineProperty(exports, "AuthController", {
        enumerable: true,
        get: function () {
          return auth_controller_1.AuthController;
        },
      });
      var change_name_controller_1 = __webpack_require__(
        "./libs/robot/core/src/controllers/change-name.controller.ts"
      );
      Object.defineProperty(exports, "ChangeNameController", {
        enumerable: true,
        get: function () {
          return change_name_controller_1.ChangeNameController;
        },
      });

      /***/
    },

    /***/ "./libs/robot/core/src/core/application.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Application = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      const browser_manager_1 = __webpack_require__(
        "./libs/robot/core/src/managers/browser.manager.ts"
      );
      class Application {
        constructor() {
          this.isps = new Map();
          this.browserManager = new browser_manager_1.BrowserManager();
          this.results = new Map();
          this.tasks = new Map();
          this.responses = new Map();
        }
        openBrowser(headless = true) {
          return this.browserManager.openBrowser(headless);
        }
        registerIsp(isp) {
          this.isps.set(isp.name, isp);
        }
        executeTask(task) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.runningTask)
              throw new Error(`Task ${this.runningTask.id} is running`);
            this.runningTask = task;
            this.tasks.set(task.id, task);
            const result = new shared_1.Result();
            const response = new shared_1.Response();
            this.responses.set(task.id, response);
            this.results.set(task.id, result);
            const isp = this.isps.get(task.isp);
            if (!isp) throw new Error(`ISP ${task.isp} not found`);
            const controller = isp.getController();
            const handler = controller.getHandler(task.action);
            if (!handler)
              throw new Error(
                `Handler ${task.action} for ${task.isp} is not found`
              );
            const { context, stoper } =
              yield this.browserManager.createNewContext(
                task.id,
                task.email.session
              );
            yield this.browserManager.createNewPage(context);
            const tmp = yield controller.execute(
              context,
              task,
              stoper,
              result,
              response
            );
            console.log(tmp);
            yield this.browserManager.closeContext(task.id);
            this.runningTask = undefined;
            return response;
          });
        }
        setApplicationId(id) {
          this.applicationId = id;
        }
        getApplicationId() {
          return this.applicationId;
        }
        stopTaskById(id) {
          var _a;
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const resolver = this.browserManager.getResolver(id);
            console.log(`resolver`, resolver, id);
            if (!resolver) throw new Error("Resolver not found");
            yield resolver(
              (_a = this.results.get(id)) !== null && _a !== void 0
                ? _a
                : new shared_1.Result()
            );
            yield this.browserManager.closeContext(id);
          });
        }
        getTasks() {
          return [...this.tasks.values()];
        }
        getTask(id) {
          return this.tasks.get(id);
        }
        getTasksByTaskName(action) {
          return [...this.tasks.values()].filter(
            (task) => task.action === action
          );
        }
        getResultByTaskId(id) {
          console.log(this.results);
          return this.results.get(id);
        }
        getResultByJobId(id) {
          const task = [...this.tasks.values()].find(
            (task) => task.jobId === id
          );
          if (!task) return undefined;
          return this.results.get(task.id);
        }
        getResponseByTaskId(id) {
          return this.responses.get(id);
        }
        getResponseByJobId(id) {
          const task = [...this.tasks.values()].find(
            (task) => task.jobId === id
          );
          if (!task) return undefined;
          return this.responses.get(task.id);
        }
        getTaskByJobId(id) {
          return [...this.tasks.values()].find((task) => task.jobId === id);
        }
        stopTaskByJobId(id) {
          const task = this.getTaskByJobId(id);
          if (!task) return;
          return this.stopTaskById(task.id);
        }
      }
      exports.Application = Application;

      /***/
    },

    /***/ "./libs/robot/core/src/core/controller.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Controller =
        exports.buildFailResponse =
        exports.buildSuccessResponse =
          void 0;
      const tslib_1 = __webpack_require__("tslib");
      const imgur_1 = __webpack_require__("@rmp135/imgur");
      const imgur = new imgur_1.Client("43652b743b5a7a0");
      function buildSuccessResponse(response, task, result) {
        response.taskId = task.id;
        response.action = task.action;
        response.jobId = task.jobId;
        response.email = task.email.email;
        response.emailId = task.emailId;
        response.applicationId = task.applicationId;
        response.success = true;
        response.result = result;
        return response;
      }
      exports.buildSuccessResponse = buildSuccessResponse;
      function buildFailResponse(response, task, error, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          response.taskId = task.id;
          response.action = task.action;
          response.jobId = task.jobId;
          response.email = task.email.email;
          response.emailId = task.emailId;
          response.applicationId = task.applicationId;
          response.success = false;
          response.message = error.message;
          try {
            const image = yield context.pages()[0].screenshot({
              fullPage: true,
              type: "jpeg",
            });
            const imageInfo = yield imgur.Image.upload(image, {
              title: task.email.email,
              description: response.message,
            });
            response.image = imageInfo.data.link;
          } catch (e) {
            response.message = response.message + "\n" + e.message;
          }
          return response;
        });
      }
      exports.buildFailResponse = buildFailResponse;
      class Controller {
        constructor(handlers = new Map()) {
          this.handlers = handlers;
        }
        registerHandler(handler) {
          this.handlers.set(handler.name, handler);
        }
        getHandler(isp) {
          return this.handlers.get(isp);
        }
        execute(context, task, stoper, result, response) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const startedAt = Date.now();
            try {
              const handler = this.getHandler(task.action);
              if (!handler) throw new Error(`Handler ${task.action} not found`);
              console.log(handler);
              console.log(task.payload);
              const t = yield Promise.race([
                handler.handle(context, task.email, task.payload, result),
                stoper,
              ]);
              console.log(t);
              buildSuccessResponse(response, task, result);
            } catch (error) {
              yield buildFailResponse(response, task, error, context);
            }
            const finishedAt = Date.now();
            response.duration = finishedAt - startedAt;
            console.log(response);
            return response;
          });
        }
      }
      exports.Controller = Controller;

      /***/
    },

    /***/ "./libs/robot/core/src/core/handler.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Handler = void 0;
      class Handler {}
      exports.Handler = Handler;

      /***/
    },

    /***/ "./libs/robot/core/src/core/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Isp =
        exports.Handler =
        exports.Controller =
        exports.Application =
          void 0;
      var application_1 = __webpack_require__(
        "./libs/robot/core/src/core/application.ts"
      );
      Object.defineProperty(exports, "Application", {
        enumerable: true,
        get: function () {
          return application_1.Application;
        },
      });
      var controller_1 = __webpack_require__(
        "./libs/robot/core/src/core/controller.ts"
      );
      Object.defineProperty(exports, "Controller", {
        enumerable: true,
        get: function () {
          return controller_1.Controller;
        },
      });
      var handler_1 = __webpack_require__(
        "./libs/robot/core/src/core/handler.ts"
      );
      Object.defineProperty(exports, "Handler", {
        enumerable: true,
        get: function () {
          return handler_1.Handler;
        },
      });
      var isp_1 = __webpack_require__("./libs/robot/core/src/core/isp.ts");
      Object.defineProperty(exports, "Isp", {
        enumerable: true,
        get: function () {
          return isp_1.Isp;
        },
      });

      /***/
    },

    /***/ "./libs/robot/core/src/core/isp.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Isp = void 0;
      const core_1 = __webpack_require__("./libs/robot/core/src/core/index.ts");
      class Isp {
        constructor() {
          const HANDLERS = new Map();
          console.log(this.handlers);
          for (const handler of this.handlers) {
            const h = new handler();
            HANDLERS.set(h.name, h);
          }
          this.controller = new core_1.Controller(HANDLERS);
        }
        getController() {
          return this.controller;
        }
      }
      exports.Isp = Isp;

      /***/
    },

    /***/ "./libs/robot/core/src/decorators/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ISP = void 0;
      var isp_decorator_1 = __webpack_require__(
        "./libs/robot/core/src/decorators/isp.decorator.ts"
      );
      Object.defineProperty(exports, "ISP", {
        enumerable: true,
        get: function () {
          return isp_decorator_1.ISP;
        },
      });

      /***/
    },

    /***/ "./libs/robot/core/src/decorators/isp.decorator.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ISP = void 0;
      function ISP(name, handlers) {
        return function (target) {
          target.prototype.name = name;
          target.prototype.handlers = handlers;
        };
      }
      exports.ISP = ISP;

      /***/
    },

    /***/ "./libs/robot/core/src/handlers/auth.handler.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthHandler = void 0;
      const handler_1 = __webpack_require__(
        "./libs/robot/core/src/core/handler.ts"
      );
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      class AuthHandler extends handler_1.Handler {
        constructor() {
          super(...arguments);
          this.name = shared_1.TaskEnum.AUTHENTICATION;
        }
      }
      exports.AuthHandler = AuthHandler;

      /***/
    },

    /***/ "./libs/robot/core/src/handlers/change-name.handler.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameHandler = void 0;
      const handler_1 = __webpack_require__(
        "./libs/robot/core/src/core/handler.ts"
      );
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      class ChangeNameHandler extends handler_1.Handler {
        constructor() {
          super(...arguments);
          this.name = shared_1.TaskEnum.CHANGE_NAME;
        }
      }
      exports.ChangeNameHandler = ChangeNameHandler;

      /***/
    },

    /***/ "./libs/robot/core/src/handlers/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetupRuleHandler =
        exports.ReplyHandler =
        exports.RemoveDeviceHandler =
        exports.ChangeNameHandler =
        exports.AuthHandler =
          void 0;
      var auth_handler_1 = __webpack_require__(
        "./libs/robot/core/src/handlers/auth.handler.ts"
      );
      Object.defineProperty(exports, "AuthHandler", {
        enumerable: true,
        get: function () {
          return auth_handler_1.AuthHandler;
        },
      });
      var change_name_handler_1 = __webpack_require__(
        "./libs/robot/core/src/handlers/change-name.handler.ts"
      );
      Object.defineProperty(exports, "ChangeNameHandler", {
        enumerable: true,
        get: function () {
          return change_name_handler_1.ChangeNameHandler;
        },
      });
      var remove_devices_handler_1 = __webpack_require__(
        "./libs/robot/core/src/handlers/remove-devices.handler.ts"
      );
      Object.defineProperty(exports, "RemoveDeviceHandler", {
        enumerable: true,
        get: function () {
          return remove_devices_handler_1.RemoveDeviceHandler;
        },
      });
      var reply_handler_1 = __webpack_require__(
        "./libs/robot/core/src/handlers/reply.handler.ts"
      );
      Object.defineProperty(exports, "ReplyHandler", {
        enumerable: true,
        get: function () {
          return reply_handler_1.ReplyHandler;
        },
      });
      var setup_rule_handler_1 = __webpack_require__(
        "./libs/robot/core/src/handlers/setup-rule.handler.ts"
      );
      Object.defineProperty(exports, "SetupRuleHandler", {
        enumerable: true,
        get: function () {
          return setup_rule_handler_1.SetupRuleHandler;
        },
      });

      /***/
    },

    /***/ "./libs/robot/core/src/handlers/remove-devices.handler.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RemoveDeviceHandler = void 0;
      const handler_1 = __webpack_require__(
        "./libs/robot/core/src/core/handler.ts"
      );
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      class RemoveDeviceHandler extends handler_1.Handler {
        constructor() {
          super(...arguments);
          this.name = shared_1.TaskEnum.REMOVE_DEVICES;
        }
      }
      exports.RemoveDeviceHandler = RemoveDeviceHandler;

      /***/
    },

    /***/ "./libs/robot/core/src/handlers/reply.handler.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplyHandler = void 0;
      const handler_1 = __webpack_require__(
        "./libs/robot/core/src/core/handler.ts"
      );
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      class ReplyHandler extends handler_1.Handler {
        constructor() {
          super(...arguments);
          this.name = shared_1.TaskEnum.REPLY;
        }
      }
      exports.ReplyHandler = ReplyHandler;

      /***/
    },

    /***/ "./libs/robot/core/src/handlers/setup-rule.handler.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetupRuleHandler = void 0;
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      const core_1 = __webpack_require__("./libs/robot/core/src/core/index.ts");
      class SetupRuleHandler extends core_1.Handler {
        constructor() {
          super(...arguments);
          this.name = shared_1.TaskEnum.SETUP_RULE;
        }
      }
      exports.SetupRuleHandler = SetupRuleHandler;

      /***/
    },

    /***/ "./libs/robot/core/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/robot/core/src/handlers/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/robot/core/src/controllers/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/robot/core/src/core/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/robot/core/src/managers/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/robot/core/src/decorators/index.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/robot/core/src/managers/browser.manager.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BrowserManager = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const fs_1 = __webpack_require__("fs");
      const crypto_1 = __webpack_require__("crypto");
      const playwright_core_1 = __webpack_require__("playwright-core");
      const path_1 = __webpack_require__("path");
      const zlib_1 = __webpack_require__("zlib");
      class Context {}
      class BrowserManager {
        constructor() {
          this.contexts = new Map();
          this.stopers = new Map();
          this.resolvers = new Map();
        }
        openBrowser(headless = true) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.browser = yield playwright_core_1.firefox.launch({
              headless: headless,
              args: ['--lang="it-IT"'],
            });
            return this.browser;
          });
        }
        createNewContext(taskId, session) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const options = {
              locale: "en-US",
              bypassCSP: true,
              colorScheme: "dark",
              acceptDownloads: true,
              permissions: ["geolocation"],
              reducedMotion: "reduce",
              extraHTTPHeaders: {
                "accept-language": "en-US,en;q=0.9",
              },
            };
            if (session) {
              const s = JSON.parse(
                (0, zlib_1.inflateSync)(
                  Buffer.from(session, "base64")
                ).toString()
              );
              const state = JSON.parse(s);
              options.storageState = state;
            }
            const context = yield this.browser.newContext(options);
            const contextId = taskId;
            this.contexts.set(contextId, context);
            const stoper = new Promise((resolve) => {
              this.resolvers.set(contextId, resolve);
            });
            this.stopers.set(contextId, stoper);
            return { context, stoper };
          });
        }
        getContextId(context) {
          return (0, crypto_1.createHash)("md5")
            .update(JSON.stringify(context))
            .digest("hex");
        }
        createNewPage(context) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const page = yield context.newPage();
            const intialScript = (0, fs_1.readFileSync)(
              (0, path_1.join)(__dirname, "utils/initial-context.js")
            ).toString();
            yield page.addInitScript(intialScript);
          });
        }
        closeContext(id) {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const context = this.contexts.get(id);
            this.contexts.delete(id);
            context === null || context === void 0 ? void 0 : context.close();
          });
        }
        closeBrowser() {
          return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
          });
        }
        getResolver(id) {
          console.log(`getResolver`, this.resolvers);
          return this.resolvers.get(id);
        }
      }
      exports.BrowserManager = BrowserManager;

      /***/
    },

    /***/ "./libs/robot/core/src/managers/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BrowserManager = void 0;
      var browser_manager_1 = __webpack_require__(
        "./libs/robot/core/src/managers/browser.manager.ts"
      );
      Object.defineProperty(exports, "BrowserManager", {
        enumerable: true,
        get: function () {
          return browser_manager_1.BrowserManager;
        },
      });

      /***/
    },

    /***/ "./libs/robot/gmail/src/gmail.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Gmail = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      const handlers_1 = __webpack_require__(
        "./libs/robot/gmail/src/handlers.ts"
      );
      let Gmail = class Gmail extends core_1.Isp {};
      Gmail = tslib_1.__decorate(
        [(0, core_1.ISP)(shared_1.IspEnum.GMAIL, handlers_1.GMAIL_HANDLERS)],
        Gmail
      );
      exports.Gmail = Gmail;

      /***/
    },

    /***/ "./libs/robot/gmail/src/handlers.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GMAIL_HANDLERS = void 0;
      const gmail_auth_handler_1 = __webpack_require__(
        "./libs/handlers/gmail/gmail-auth-handler/src/index.ts"
      );
      const gmail_change_name_handler_1 = __webpack_require__(
        "./libs/handlers/gmail/gmail-change-name-handler/src/index.ts"
      );
      // import { GmailReportingHandler } from '@gwarm/gmail-reporting-handler';
      const gmail_remove_devices_handler_1 = __webpack_require__(
        "./libs/handlers/gmail/gmail-remove-devices-handler/src/index.ts"
      );
      const gmail_reply_handler_1 = __webpack_require__(
        "./libs/handlers/gmail/gmail-reply-handler/src/index.ts"
      );
      const gmail_setup_rule_handler_1 = __webpack_require__(
        "./libs/handlers/gmail/gmail-setup-rule-handler/src/index.ts"
      );
      exports.GMAIL_HANDLERS = [
        gmail_auth_handler_1.GmailAuthHandler,
        gmail_change_name_handler_1.GmailChangeNameHandler,
        gmail_remove_devices_handler_1.GmailRemoveDevicesHandler,
        gmail_reply_handler_1.GmailReplyHandler,
        gmail_setup_rule_handler_1.GmailSetupRuleHandler,
        // GmailReportingHandler,
      ];

      /***/
    },

    /***/ "./libs/robot/gmail/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Gmail = void 0;
      var gmail_1 = __webpack_require__("./libs/robot/gmail/src/gmail.ts");
      Object.defineProperty(exports, "Gmail", {
        enumerable: true,
        get: function () {
          return gmail_1.Gmail;
        },
      });

      /***/
    },

    /***/ "./libs/robot/hotmail/src/handlers.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.HOTMAIL_HANDLERS = void 0;
      const hotmail_auth_handler_1 = __webpack_require__(
        "./libs/handlers/hotmail/hotmail-auth-handler/src/index.ts"
      );
      exports.HOTMAIL_HANDLERS = [hotmail_auth_handler_1.HotmailAuthHandler];

      /***/
    },

    /***/ "./libs/robot/hotmail/src/hotmail.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Hotmail = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const handlers_1 = __webpack_require__(
        "./libs/robot/hotmail/src/handlers.ts"
      );
      const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      let Hotmail = class Hotmail extends core_1.Isp {};
      Hotmail = tslib_1.__decorate(
        [
          (0, core_1.ISP)(
            shared_1.IspEnum.HOTMAIL,
            handlers_1.HOTMAIL_HANDLERS
          ),
        ],
        Hotmail
      );
      exports.Hotmail = Hotmail;

      /***/
    },

    /***/ "./libs/robot/hotmail/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/robot/hotmail/src/hotmail.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/robot/proton/src/handlers.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PROTON_HANDLERS = void 0;
      const proton_auth_handler_1 = __webpack_require__(
        "./libs/handlers/proton/proton-auth-handler/src/index.ts"
      );
      const proton_change_name_handler_1 = __webpack_require__(
        "./libs/handlers/proton/proton-change-name-handler/src/index.ts"
      );
      const proton_setup_rule_handler_1 = __webpack_require__(
        "./libs/handlers/proton/proton-setup-rule-handler/src/index.ts"
      );
      exports.PROTON_HANDLERS = [
        proton_auth_handler_1.ProtonAuthHandler,
        proton_change_name_handler_1.ProtonChangeNameHandler,
        proton_setup_rule_handler_1.ProtonSetupRuleHandler,
      ];

      /***/
    },

    /***/ "./libs/robot/proton/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Proton = void 0;
      var proton_1 = __webpack_require__("./libs/robot/proton/src/proton.ts");
      Object.defineProperty(exports, "Proton", {
        enumerable: true,
        get: function () {
          return proton_1.Proton;
        },
      });

      /***/
    },

    /***/ "./libs/robot/proton/src/proton.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Proton = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__("./libs/robot/core/src/index.ts");
      const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
      const handlers_1 = __webpack_require__(
        "./libs/robot/proton/src/handlers.ts"
      );
      let Proton = class Proton extends core_1.Isp {};
      Proton = tslib_1.__decorate(
        [(0, core_1.ISP)(shared_1.IspEnum.PROTON, handlers_1.PROTON_HANDLERS)],
        Proton
      );
      exports.Proton = Proton;

      /***/
    },

    /***/ "./libs/shared/src/decorators/api-with-token.decorator.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ApiWithTokenResponse = void 0;
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const common_1 = __webpack_require__("@nestjs/common");
      const ApiWithTokenResponse = (options) => {
        return (0, common_1.applyDecorators)(
          (0, swagger_1.ApiOperation)(options.operationOptions),
          (0, swagger_1.ApiResponse)(
            Object.assign({ status: 200 }, options.responseMetadata)
          )
        );
      };
      exports.ApiWithTokenResponse = ApiWithTokenResponse;

      /***/
    },

    /***/ "./libs/shared/src/decorators/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/shared/src/decorators/api-with-token.decorator.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/shared/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/shared.module.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/services/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/decorators/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/utils/index.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/shared/src/services/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/services/token.service.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/shared/src/services/token.service.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TokenService = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const common_1 = __webpack_require__("@nestjs/common");
      const core_1 = __webpack_require__("@nestjs/core");
      const express_1 = __webpack_require__("express");
      let TokenService = class TokenService {
        constructor(request) {
          this.request = request;
        }
        getJwt() {
          if (!this.request.headers.authorization) {
            return "";
          }
          return this.request.headers.authorization.split("Bearer")[1].trim();
        }
      };
      TokenService = tslib_1.__decorate(
        [
          (0, common_1.Injectable)({
            scope: common_1.Scope.REQUEST,
          }),
          tslib_1.__param(0, (0, common_1.Inject)(core_1.REQUEST)),
          tslib_1.__metadata("design:paramtypes", [
            typeof (_a =
              typeof express_1.Request !== "undefined" && express_1.Request) ===
            "function"
              ? _a
              : Object,
          ]),
        ],
        TokenService
      );
      exports.TokenService = TokenService;

      /***/
    },

    /***/ "./libs/shared/src/shared.module.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SharedModule = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const common_1 = __webpack_require__("@nestjs/common");
      const token_service_1 = __webpack_require__(
        "./libs/shared/src/services/token.service.ts"
      );
      let SharedModule = class SharedModule {};
      SharedModule = tslib_1.__decorate(
        [
          (0, common_1.Global)(),
          (0, common_1.Module)({
            controllers: [],
            providers: [token_service_1.TokenService],
            exports: [token_service_1.TokenService],
          }),
        ],
        SharedModule
      );
      exports.SharedModule = SharedModule;

      /***/
    },

    /***/ "./libs/shared/src/utils/distributed-random.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shuffle = exports.distributedIntRandom = void 0;
      function distributedIntRandom(arr) {
        let tmp = [];
        for (let i = 0; i < arr.length; i++) {
          tmp = [...tmp, ...new Array(arr[i]).fill(i)];
        }
        tmp = shuffle(tmp);
        const index = Math.floor(
          Math.random() * arr.reduce((a, b) => a + b, 1)
        );
        return tmp[index];
      }
      exports.distributedIntRandom = distributedIntRandom;
      function shuffle(array) {
        let currentIndex = array.length,
          randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
          ];
        }
        return array;
      }
      exports.shuffle = shuffle;

      /***/
    },

    /***/ "./libs/shared/src/utils/either.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isSuccess =
        exports.isFail =
        exports.success =
        exports.fail =
          void 0;
      const fail = (error) => ({
        isFail: true,
        error,
      });
      exports.fail = fail;
      const success = (value) => ({
        isFail: false,
        value,
      });
      exports.success = success;
      function isFail(either) {
        return either.isFail;
      }
      exports.isFail = isFail;
      function isSuccess(either) {
        return !either.isFail;
      }
      exports.isSuccess = isSuccess;

      /***/
    },

    /***/ "./libs/shared/src/utils/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/utils/either.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/shared/src/utils/distributed-random.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/core/application.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Application = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      class Application {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Application.prototype,
        "type",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Application.prototype,
        "source",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Application.prototype,
        "link",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Application.prototype,
        "capacity",
        void 0
      );
      exports.Application = Application;

      /***/
    },

    /***/ "./libs/views/shared/src/core/email.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Email = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const class_validator_1 = __webpack_require__("class-validator");
      class Email {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsEmail)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Email.prototype,
        "email",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsString)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Email.prototype,
        "password",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsEmail)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Email.prototype,
        "confirmationEmail",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)(),
          (0, class_validator_1.IsEmail)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Email.prototype,
        "session",
        void 0
      );
      exports.Email = Email;

      /***/
    },

    /***/ "./libs/views/shared/src/core/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/payload.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/result.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/task.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/response.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/email.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/job-config.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/application.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/core/job-config.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });

      /***/
    },

    /***/ "./libs/views/shared/src/core/payload.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Payload = void 0;
      class Payload {}
      exports.Payload = Payload;

      /***/
    },

    /***/ "./libs/views/shared/src/core/response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Response = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      class Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Response.prototype,
        "taskId",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Response.prototype,
        "jobId",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ enum: enums_1.TaskEnum }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" && enums_1.TaskEnum) ===
              "function"
              ? _a
              : Object
          ),
        ],
        Response.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        Response.prototype,
        "success",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Response.prototype,
        "message",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)(),
          tslib_1.__metadata("design:type", String),
        ],
        Response.prototype,
        "image",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Response.prototype,
        "duration",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        Response.prototype,
        "email",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Response.prototype,
        "application",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Response.prototype,
        "emailId",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Response.prototype,
        "applicationId",
        void 0
      );
      exports.Response = Response;

      /***/
    },

    /***/ "./libs/views/shared/src/core/result.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Result = void 0;
      class Result {}
      exports.Result = Result;

      /***/
    },

    /***/ "./libs/views/shared/src/core/task.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b, _c;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Task = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const email_1 = __webpack_require__(
        "./libs/views/shared/src/core/email.ts"
      );
      class Task {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Task.prototype,
        "id",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Task.prototype,
        "jobId",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ enum: enums_1.TaskEnum }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" && enums_1.TaskEnum) ===
              "function"
              ? _a
              : Object
          ),
        ],
        Task.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof email_1.Email !== "undefined" && email_1.Email) ===
              "function"
              ? _b
              : Object
          ),
        ],
        Task.prototype,
        "email",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ enum: enums_1.IspEnum }),
          tslib_1.__metadata(
            "design:type",
            typeof (_c =
              typeof enums_1.IspEnum !== "undefined" && enums_1.IspEnum) ===
              "function"
              ? _c
              : Object
          ),
        ],
        Task.prototype,
        "isp",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Task.prototype,
        "emailId",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        Task.prototype,
        "applicationId",
        void 0
      );
      exports.Task = Task;

      /***/
    },

    /***/ "./libs/views/shared/src/enums/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/enums/task.enum.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/enums/isp.enum.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/enums/task-status.enum.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/enums/isp.enum.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.IspEnum = void 0;
      var IspEnum;
      (function (IspEnum) {
        IspEnum["AOL"] = "AOL";
        IspEnum["GMAIL"] = "GMAIL";
        IspEnum["HOTMAIL"] = "HOTMAIL";
        IspEnum["YAHOO"] = "YAHOO";
        IspEnum["PROTON"] = "PROTON";
      })((IspEnum = exports.IspEnum || (exports.IspEnum = {})));

      /***/
    },

    /***/ "./libs/views/shared/src/enums/task-status.enum.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TaskStatusEnum = void 0;
      var TaskStatusEnum;
      (function (TaskStatusEnum) {
        TaskStatusEnum["PENDING"] = "PENDING";
        TaskStatusEnum["RUNNING"] = "RUNNING";
        TaskStatusEnum["SUCCESS"] = "SUCCESS";
        TaskStatusEnum["FAILED"] = "FAILED";
      })(
        (TaskStatusEnum =
          exports.TaskStatusEnum || (exports.TaskStatusEnum = {}))
      );

      /***/
    },

    /***/ "./libs/views/shared/src/enums/task.enum.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TaskEnum = void 0;
      var TaskEnum;
      (function (TaskEnum) {
        TaskEnum["AUTHENTICATION"] = "AUTHENTICATION";
        TaskEnum["CHANGE_NAME"] = "CHANGE_NAME";
        TaskEnum["ADD_RULE"] = "ADD_RULE";
        TaskEnum["REPORTING"] = "REPORTING";
        TaskEnum["REMOVE_DEVICES"] = "REMOVE_DEVICES";
        TaskEnum["REPLY"] = "REPLY";
        TaskEnum["SETUP_RULE"] = "SETUP_RULE";
        TaskEnum["CREATE_PROTON"] = "CREATE_PROTON";
      })((TaskEnum = exports.TaskEnum || (exports.TaskEnum = {})));

      /***/
    },

    /***/ "./libs/views/shared/src/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/tasks/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/core/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/enums/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/payloads/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/results/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/jobs/index.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/responses/index.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/add-rule-config.job.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AddRuleConfigJob = void 0;
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const responses_1 = __webpack_require__(
        "./libs/views/shared/src/responses/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      const tasks_1 = __webpack_require__(
        "./libs/views/shared/src/tasks/index.ts"
      );
      exports.AddRuleConfigJob = {
        action: enums_1.TaskEnum.ADD_RULE,
        payload: payloads_1.ChangeNamePayload,
        result: results_1.AuthResult,
        response: responses_1.AddRuleResponse,
        task: tasks_1.AddRuleTask,
      };

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/auth-config.job.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthConfigJob = void 0;
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const responses_1 = __webpack_require__(
        "./libs/views/shared/src/responses/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      const tasks_1 = __webpack_require__(
        "./libs/views/shared/src/tasks/index.ts"
      );
      exports.AuthConfigJob = {
        action: enums_1.TaskEnum.AUTHENTICATION,
        payload: payloads_1.AuthPayload,
        result: results_1.AuthResult,
        response: responses_1.AuthResponse,
        task: tasks_1.AuthTask,
      };

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/change-name-config.job.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameConfigJob = void 0;
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const responses_1 = __webpack_require__(
        "./libs/views/shared/src/responses/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      const tasks_1 = __webpack_require__(
        "./libs/views/shared/src/tasks/index.ts"
      );
      exports.ChangeNameConfigJob = {
        action: enums_1.TaskEnum.CHANGE_NAME,
        payload: payloads_1.ChangeNamePayload,
        result: results_1.ChangeNameResult,
        response: responses_1.ChangeNameResponse,
        task: tasks_1.ChangeNameTask,
      };

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.JOBS_CONFIG = void 0;
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/jobs/auth-config.job.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/jobs/change-name-config.job.ts"
        ),
        exports
      );
      const add_rule_config_job_1 = __webpack_require__(
        "./libs/views/shared/src/jobs/add-rule-config.job.ts"
      );
      const auth_config_job_1 = __webpack_require__(
        "./libs/views/shared/src/jobs/auth-config.job.ts"
      );
      const change_name_config_job_1 = __webpack_require__(
        "./libs/views/shared/src/jobs/change-name-config.job.ts"
      );
      const remove_devices_config_job_1 = __webpack_require__(
        "./libs/views/shared/src/jobs/remove-devices-config.job.ts"
      );
      const reply_config_job_1 = __webpack_require__(
        "./libs/views/shared/src/jobs/reply-config.job.ts"
      );
      const setup_rule_config_job_1 = __webpack_require__(
        "./libs/views/shared/src/jobs/setup-rule-config.job.ts"
      );
      exports.JOBS_CONFIG = [
        auth_config_job_1.AuthConfigJob,
        change_name_config_job_1.ChangeNameConfigJob,
        add_rule_config_job_1.AddRuleConfigJob,
        remove_devices_config_job_1.RemoveDevicesConfigJob,
        reply_config_job_1.ReplyConfigJob,
        setup_rule_config_job_1.SetupRuleConfigJob,
      ];

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/remove-devices-config.job.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RemoveDevicesConfigJob = void 0;
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const remove_device_response_1 = __webpack_require__(
        "./libs/views/shared/src/responses/remove-device.response.ts"
      );
      const tasks_1 = __webpack_require__(
        "./libs/views/shared/src/tasks/index.ts"
      );
      exports.RemoveDevicesConfigJob = {
        action: enums_1.TaskEnum.REMOVE_DEVICES,
        payload: core_1.Payload,
        result: core_1.Result,
        response: remove_device_response_1.RemoveDevicesResponse,
        task: tasks_1.RemoveDevicesTask,
      };

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/reply-config.job.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplyConfigJob = void 0;
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const reply_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/reply.payload.ts"
      );
      const responses_1 = __webpack_require__(
        "./libs/views/shared/src/responses/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      const tasks_1 = __webpack_require__(
        "./libs/views/shared/src/tasks/index.ts"
      );
      exports.ReplyConfigJob = {
        action: enums_1.TaskEnum.REPLY,
        payload: reply_payload_1.ReplyPayload,
        result: results_1.ReplyResult,
        response: responses_1.ReplyResponse,
        task: tasks_1.ReplyTask,
      };

      /***/
    },

    /***/ "./libs/views/shared/src/jobs/setup-rule-config.job.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetupRuleConfigJob = void 0;
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const responses_1 = __webpack_require__(
        "./libs/views/shared/src/responses/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      const tasks_1 = __webpack_require__(
        "./libs/views/shared/src/tasks/index.ts"
      );
      exports.SetupRuleConfigJob = {
        action: enums_1.TaskEnum.SETUP_RULE,
        payload: payloads_1.SetupRulePayload,
        result: results_1.SetupRuleResult,
        response: responses_1.SetupRuleResponse,
        task: tasks_1.ReplyTask,
      };

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/add-rule.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AddRulePayload = void 0;
      const payload_1 = __webpack_require__(
        "./libs/views/shared/src/core/payload.ts"
      );
      class AddRulePayload extends payload_1.Payload {}
      exports.AddRulePayload = AddRulePayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/auth.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthPayload = void 0;
      const payload_1 = __webpack_require__(
        "./libs/views/shared/src/core/payload.ts"
      );
      class AuthPayload extends payload_1.Payload {}
      exports.AuthPayload = AuthPayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/change-name.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNamePayload = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const class_validator_1 = __webpack_require__("class-validator");
      const payload_1 = __webpack_require__(
        "./libs/views/shared/src/core/payload.ts"
      );
      class ChangeNamePayload extends payload_1.Payload {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsString)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        ChangeNamePayload.prototype,
        "name",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ default: false }),
          (0, class_validator_1.IsBoolean)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        ChangeNamePayload.prototype,
        "withPlus",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ default: 0, type: Number }),
          tslib_1.__metadata("design:type", Number),
        ],
        ChangeNamePayload.prototype,
        "numberOfPoints",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)(),
          (0, class_validator_1.IsString)(),
          tslib_1.__metadata("design:type", String),
        ],
        ChangeNamePayload.prototype,
        "extension",
        void 0
      );
      exports.ChangeNamePayload = ChangeNamePayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/create-proton.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CreateProtonPayload = void 0;
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      class CreateProtonPayload extends core_1.Payload {}
      exports.CreateProtonPayload = CreateProtonPayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PAYLOADS = void 0;
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/payloads/auth.payload.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/change-name.payload.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/reporting.payload.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/reporting/index.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/reply.payload.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/remove-devices.payload.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/add-rule.payload.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/setup-rule.payload.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/create-proton.payload.ts"
        ),
        exports
      );
      const auth_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/auth.payload.ts"
      );
      const change_name_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/change-name.payload.ts"
      );
      const reporting_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/reporting.payload.ts"
      );
      const reply_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/reply.payload.ts"
      );
      const remove_devices_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/remove-devices.payload.ts"
      );
      const add_rule_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/add-rule.payload.ts"
      );
      const setup_rule_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/setup-rule.payload.ts"
      );
      const create_proton_payload_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/create-proton.payload.ts"
      );
      exports.PAYLOADS = [
        reply_payload_1.ReplyPayload,
        auth_payload_1.AuthPayload,
        change_name_payload_1.ChangeNamePayload,
        reporting_payload_1.ReportingPayload,
        remove_devices_payload_1.RemoveDevicesPayload,
        add_rule_payload_1.AddRulePayload,
        setup_rule_payload_1.SetupRulePayload,
        create_proton_payload_1.CreateProtonPayload,
      ];

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/remove-devices.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RemoveDevicesPayload = void 0;
      const payload_1 = __webpack_require__(
        "./libs/views/shared/src/core/payload.ts"
      );
      class RemoveDevicesPayload extends payload_1.Payload {}
      exports.RemoveDevicesPayload = RemoveDevicesPayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/reply.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplyPayload = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const class_validator_1 = __webpack_require__("class-validator");
      const payload_1 = __webpack_require__(
        "./libs/views/shared/src/core/payload.ts"
      );
      class Placeholder {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ type: String }),
          tslib_1.__metadata("design:type", String),
        ],
        Placeholder.prototype,
        "key",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ type: String }),
          tslib_1.__metadata("design:type", Array),
        ],
        Placeholder.prototype,
        "value",
        void 0
      );
      class ReplyPayload extends payload_1.Payload {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsString)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        ReplyPayload.prototype,
        "filter",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            isArray: true,
            type: Placeholder,
          }),
          tslib_1.__metadata("design:type", Array),
        ],
        ReplyPayload.prototype,
        "placeholders",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsString)(),
          (0, class_validator_1.IsNotEmpty)(),
          tslib_1.__metadata("design:type", String),
        ],
        ReplyPayload.prototype,
        "body",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ default: 500 }),
          (0, class_validator_1.IsNumber)(),
          (0, class_validator_1.IsPositive)(),
          tslib_1.__metadata("design:type", Number),
        ],
        ReplyPayload.prototype,
        "limit",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({ default: false }),
          (0, class_validator_1.IsBoolean)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        ReplyPayload.prototype,
        "reset",
        void 0
      );
      exports.ReplyPayload = ReplyPayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/reporting.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReportingFilterPayload = exports.ReportingPayload = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      class ReportingPayload extends core_1.Payload {}
      exports.ReportingPayload = ReportingPayload;
      class ReportingFilterPayload {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)(),
          tslib_1.__metadata("design:type", String),
        ],
        ReportingFilterPayload.prototype,
        "subject",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)(),
          tslib_1.__metadata("design:type", String),
        ],
        ReportingFilterPayload.prototype,
        "from",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)(),
          tslib_1.__metadata("design:type", String),
        ],
        ReportingFilterPayload.prototype,
        "email",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiPropertyOptional)({
            default: new Date().setDate(new Date().getDate() - 1),
          }),
          tslib_1.__metadata("design:type", Number),
        ],
        ReportingFilterPayload.prototype,
        "date",
        void 0
      );
      exports.ReportingFilterPayload = ReportingFilterPayload;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/reporting/inbox.payloads.ts":
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ReportingInboxPyload = void 0;
        const tslib_1 = __webpack_require__("tslib");
        const swagger_1 = __webpack_require__("@nestjs/swagger");
        class ReportingInboxPyload {}
        tslib_1.__decorate(
          [
            (0, swagger_1.ApiPropertyOptional)({
              default: 0,
              minimum: 0,
              maximum: 100,
            }),
            tslib_1.__metadata("design:type", Number),
          ],
          ReportingInboxPyload.prototype,
          "archive",
          void 0
        );
        tslib_1.__decorate(
          [
            (0, swagger_1.ApiPropertyOptional)({
              default: 0,
              minimum: 0,
              maximum: 100,
            }),
            tslib_1.__metadata("design:type", Number),
          ],
          ReportingInboxPyload.prototype,
          "delete",
          void 0
        );
        tslib_1.__decorate(
          [
            (0, swagger_1.ApiPropertyOptional)({
              default: 0,
              minimum: 0,
              maximum: 100,
            }),
            tslib_1.__metadata("design:type", Number),
          ],
          ReportingInboxPyload.prototype,
          "star",
          void 0
        );
        tslib_1.__decorate(
          [
            (0, swagger_1.ApiPropertyOptional)({
              default: 0,
              minimum: 0,
              maximum: 100,
            }),
            tslib_1.__metadata("design:type", Number),
          ],
          ReportingInboxPyload.prototype,
          "important",
          void 0
        );
        exports.ReportingInboxPyload = ReportingInboxPyload;

        /***/
      },

    /***/ "./libs/views/shared/src/payloads/reporting/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/reporting/inbox.payloads.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/reporting/spam.payloads.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/payloads/reporting/promotion.payloads.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/reporting/promotion.payloads.ts":
      /***/ (__unused_webpack_module, exports) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ReportingPromitionsOthers =
          exports.ReportingPromotionsActions =
          exports.ReportingPromotionsPayload =
            void 0;
        class ReportingPromotionsPayload {}
        exports.ReportingPromotionsPayload = ReportingPromotionsPayload;
        class ReportingPromotionsActions {}
        exports.ReportingPromotionsActions = ReportingPromotionsActions;
        class ReportingPromitionsOthers {}
        exports.ReportingPromitionsOthers = ReportingPromitionsOthers;

        /***/
      },

    /***/ "./libs/views/shared/src/payloads/reporting/spam.payloads.ts": /***/ (
      __unused_webpack_module,
      exports
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReportingSpamOthers =
        exports.ReportingSpamActions =
        exports.ReportingSpamPayload =
          void 0;
      class ReportingSpamPayload {}
      exports.ReportingSpamPayload = ReportingSpamPayload;
      class ReportingSpamActions {}
      exports.ReportingSpamActions = ReportingSpamActions;
      class ReportingSpamOthers {}
      exports.ReportingSpamOthers = ReportingSpamOthers;

      /***/
    },

    /***/ "./libs/views/shared/src/payloads/setup-rule.payload.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetupRulePayload = void 0;
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      class SetupRulePayload extends core_1.Payload {}
      exports.SetupRulePayload = SetupRulePayload;

      /***/
    },

    /***/ "./libs/views/shared/src/responses/add-rule.response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AddRuleResponse = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      class AddRuleResponse extends core_1.Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.ADD_RULE,
            default: enums_1.TaskEnum.ADD_RULE,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.ADD_RULE) === "function"
              ? _a
              : Object
          ),
        ],
        AddRuleResponse.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof results_1.AddRuleRsult !== "undefined" &&
              results_1.AddRuleRsult) === "function"
              ? _b
              : Object
          ),
        ],
        AddRuleResponse.prototype,
        "result",
        void 0
      );
      exports.AddRuleResponse = AddRuleResponse;

      /***/
    },

    /***/ "./libs/views/shared/src/responses/auth.response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthResponse = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      class AuthResponse extends core_1.Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.AUTHENTICATION,
            default: enums_1.TaskEnum.AUTHENTICATION,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.AUTHENTICATION) === "function"
              ? _a
              : Object
          ),
        ],
        AuthResponse.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof results_1.AuthResult !== "undefined" &&
              results_1.AuthResult) === "function"
              ? _b
              : Object
          ),
        ],
        AuthResponse.prototype,
        "result",
        void 0
      );
      exports.AuthResponse = AuthResponse;

      /***/
    },

    /***/ "./libs/views/shared/src/responses/change-name.response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameResponse = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      class ChangeNameResponse extends core_1.Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.CHANGE_NAME,
            default: enums_1.TaskEnum.CHANGE_NAME,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.CHANGE_NAME) === "function"
              ? _a
              : Object
          ),
        ],
        ChangeNameResponse.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof results_1.ChangeNameResult !== "undefined" &&
              results_1.ChangeNameResult) === "function"
              ? _b
              : Object
          ),
        ],
        ChangeNameResponse.prototype,
        "result",
        void 0
      );
      exports.ChangeNameResponse = ChangeNameResponse;

      /***/
    },

    /***/ "./libs/views/shared/src/responses/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/responses/auth.response.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/responses/change-name.response.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/responses/reply.response.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/responses/add-rule.response.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/responses/setup-rule.response.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/responses/remove-device.response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RemoveDevicesResponse = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      class RemoveDevicesResponse extends core_1.Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.REMOVE_DEVICES,
            default: enums_1.TaskEnum.REMOVE_DEVICES,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.REMOVE_DEVICES) === "function"
              ? _a
              : Object
          ),
        ],
        RemoveDevicesResponse.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof results_1.AddRuleRsult !== "undefined" &&
              results_1.AddRuleRsult) === "function"
              ? _b
              : Object
          ),
        ],
        RemoveDevicesResponse.prototype,
        "result",
        void 0
      );
      exports.RemoveDevicesResponse = RemoveDevicesResponse;

      /***/
    },

    /***/ "./libs/views/shared/src/responses/reply.response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplyResponse = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      class ReplyResponse extends core_1.Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.REPLY,
            default: enums_1.TaskEnum.REPLY,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.REPLY) === "function"
              ? _a
              : Object
          ),
        ],
        ReplyResponse.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof results_1.ReplyResult !== "undefined" &&
              results_1.ReplyResult) === "function"
              ? _b
              : Object
          ),
        ],
        ReplyResponse.prototype,
        "result",
        void 0
      );
      exports.ReplyResponse = ReplyResponse;

      /***/
    },

    /***/ "./libs/views/shared/src/responses/setup-rule.response.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetupRuleResponse = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      const results_1 = __webpack_require__(
        "./libs/views/shared/src/results/index.ts"
      );
      class SetupRuleResponse extends core_1.Response {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.SETUP_RULE,
            default: enums_1.TaskEnum.SETUP_RULE,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.SETUP_RULE) === "function"
              ? _a
              : Object
          ),
        ],
        SetupRuleResponse.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof results_1.SetupRuleResult !== "undefined" &&
              results_1.SetupRuleResult) === "function"
              ? _b
              : Object
          ),
        ],
        SetupRuleResponse.prototype,
        "result",
        void 0
      );
      exports.SetupRuleResponse = SetupRuleResponse;

      /***/
    },

    /***/ "./libs/views/shared/src/results/add-rule.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AddRuleRsult = void 0;
      const result_1 = __webpack_require__(
        "./libs/views/shared/src/core/result.ts"
      );
      class AddRuleRsult extends result_1.Result {}
      exports.AddRuleRsult = AddRuleRsult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/auth.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthResult = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const result_1 = __webpack_require__(
        "./libs/views/shared/src/core/result.ts"
      );
      class AuthResult extends result_1.Result {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        AuthResult.prototype,
        "token",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        AuthResult.prototype,
        "error",
        void 0
      );
      exports.AuthResult = AuthResult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/change-name.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameResult = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const result_1 = __webpack_require__(
        "./libs/views/shared/src/core/result.ts"
      );
      class ChangeNameResult extends result_1.Result {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        ChangeNameResult.prototype,
        "name",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", String),
        ],
        ChangeNameResult.prototype,
        "oldName",
        void 0
      );
      exports.ChangeNameResult = ChangeNameResult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/results/change-name.result.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/results/auth.result.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/results/pagination.result.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/results/reporting.result.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/results/reply.result.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/results/add-rule.result.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/results/remove-devices.result.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/results/setup-rule.result.ts"
        ),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/results/pagination.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PaginationResult = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const class_validator_1 = __webpack_require__("class-validator");
      class PaginationResult {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsNumber)(),
          tslib_1.__metadata("design:type", Number),
        ],
        PaginationResult.prototype,
        "size",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsNumber)(),
          tslib_1.__metadata("design:type", Number),
        ],
        PaginationResult.prototype,
        "page",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsNumber)(),
          tslib_1.__metadata("design:type", Number),
        ],
        PaginationResult.prototype,
        "totalItems",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsNumber)(),
          tslib_1.__metadata("design:type", Number),
        ],
        PaginationResult.prototype,
        "totalPages",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsBoolean)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        PaginationResult.prototype,
        "hasPrev",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          (0, class_validator_1.IsBoolean)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        PaginationResult.prototype,
        "hasNext",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Array),
        ],
        PaginationResult.prototype,
        "content",
        void 0
      );
      exports.PaginationResult = PaginationResult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/remove-devices.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RemoveDevicesResult = void 0;
      const result_1 = __webpack_require__(
        "./libs/views/shared/src/core/result.ts"
      );
      class RemoveDevicesResult extends result_1.Result {}
      exports.RemoveDevicesResult = RemoveDevicesResult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/reply.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplyResult = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const result_1 = __webpack_require__(
        "./libs/views/shared/src/core/result.ts"
      );
      class ReplyResult extends result_1.Result {}
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        ReplyResult.prototype,
        "count",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        ReplyResult.prototype,
        "limited",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Boolean),
        ],
        ReplyResult.prototype,
        "blocked",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata("design:type", Number),
        ],
        ReplyResult.prototype,
        "bounce",
        void 0
      );
      exports.ReplyResult = ReplyResult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/reporting.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReportingResult = void 0;
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      class ReportingResult extends core_1.Result {}
      exports.ReportingResult = ReportingResult;

      /***/
    },

    /***/ "./libs/views/shared/src/results/setup-rule.result.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetupRuleResult = void 0;
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      class SetupRuleResult extends core_1.Result {}
      exports.SetupRuleResult = SetupRuleResult;

      /***/
    },

    /***/ "./libs/views/shared/src/tasks/add-rule.task.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AddRuleTask = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      class AddRuleTask extends core_1.Task {
        constructor() {
          super(...arguments);
          this.action = enums_1.TaskEnum.ADD_RULE;
        }
      }
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.ADD_RULE,
            default: enums_1.TaskEnum.ADD_RULE,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.ADD_RULE) === "function"
              ? _a
              : Object
          ),
        ],
        AddRuleTask.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof payloads_1.AddRulePayload !== "undefined" &&
              payloads_1.AddRulePayload) === "function"
              ? _b
              : Object
          ),
        ],
        AddRuleTask.prototype,
        "payload",
        void 0
      );
      exports.AddRuleTask = AddRuleTask;

      /***/
    },

    /***/ "./libs/views/shared/src/tasks/auth.task.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AuthTask = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      class AuthTask extends core_1.Task {
        constructor() {
          super(...arguments);
          this.action = enums_1.TaskEnum.AUTHENTICATION;
        }
      }
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.AUTHENTICATION,
            default: enums_1.TaskEnum.AUTHENTICATION,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.AUTHENTICATION) === "function"
              ? _a
              : Object
          ),
        ],
        AuthTask.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof payloads_1.AuthPayload !== "undefined" &&
              payloads_1.AuthPayload) === "function"
              ? _b
              : Object
          ),
        ],
        AuthTask.prototype,
        "payload",
        void 0
      );
      exports.AuthTask = AuthTask;

      /***/
    },

    /***/ "./libs/views/shared/src/tasks/change-name.task.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChangeNameTask = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      class ChangeNameTask extends core_1.Task {
        constructor() {
          super(...arguments);
          this.action = enums_1.TaskEnum.CHANGE_NAME;
        }
      }
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.CHANGE_NAME,
            default: enums_1.TaskEnum.CHANGE_NAME,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.CHANGE_NAME) === "function"
              ? _a
              : Object
          ),
        ],
        ChangeNameTask.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof payloads_1.ChangeNamePayload !== "undefined" &&
              payloads_1.ChangeNamePayload) === "function"
              ? _b
              : Object
          ),
        ],
        ChangeNameTask.prototype,
        "payload",
        void 0
      );
      exports.ChangeNameTask = ChangeNameTask;

      /***/
    },

    /***/ "./libs/views/shared/src/tasks/index.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      const tslib_1 = __webpack_require__("tslib");
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/tasks/auth.task.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/tasks/change-name.task.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/tasks/reply.task.ts"),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__(
          "./libs/views/shared/src/tasks/remove-devices.task.ts"
        ),
        exports
      );
      tslib_1.__exportStar(
        __webpack_require__("./libs/views/shared/src/tasks/add-rule.task.ts"),
        exports
      );

      /***/
    },

    /***/ "./libs/views/shared/src/tasks/remove-devices.task.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RemoveDevicesTask = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      class RemoveDevicesTask extends core_1.Task {
        constructor() {
          super(...arguments);
          this.action = enums_1.TaskEnum.REMOVE_DEVICES;
        }
      }
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.REMOVE_DEVICES,
            default: enums_1.TaskEnum.REMOVE_DEVICES,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.REMOVE_DEVICES) === "function"
              ? _a
              : Object
          ),
        ],
        RemoveDevicesTask.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof payloads_1.RemoveDevicesPayload !== "undefined" &&
              payloads_1.RemoveDevicesPayload) === "function"
              ? _b
              : Object
          ),
        ],
        RemoveDevicesTask.prototype,
        "payload",
        void 0
      );
      exports.RemoveDevicesTask = RemoveDevicesTask;

      /***/
    },

    /***/ "./libs/views/shared/src/tasks/reply.task.ts": /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__
    ) => {
      var _a, _b;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplyTask = void 0;
      const tslib_1 = __webpack_require__("tslib");
      const core_1 = __webpack_require__(
        "./libs/views/shared/src/core/index.ts"
      );
      const swagger_1 = __webpack_require__("@nestjs/swagger");
      const payloads_1 = __webpack_require__(
        "./libs/views/shared/src/payloads/index.ts"
      );
      const enums_1 = __webpack_require__(
        "./libs/views/shared/src/enums/index.ts"
      );
      class ReplyTask extends core_1.Task {
        constructor() {
          super(...arguments);
          this.action = enums_1.TaskEnum.REPLY;
        }
      }
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)({
            type: enums_1.TaskEnum.REPLY,
            default: enums_1.TaskEnum.REPLY,
          }),
          tslib_1.__metadata(
            "design:type",
            typeof (_a =
              typeof enums_1.TaskEnum !== "undefined" &&
              enums_1.TaskEnum.REPLY) === "function"
              ? _a
              : Object
          ),
        ],
        ReplyTask.prototype,
        "action",
        void 0
      );
      tslib_1.__decorate(
        [
          (0, swagger_1.ApiProperty)(),
          tslib_1.__metadata(
            "design:type",
            typeof (_b =
              typeof payloads_1.ReplyPayload !== "undefined" &&
              payloads_1.ReplyPayload) === "function"
              ? _b
              : Object
          ),
        ],
        ReplyTask.prototype,
        "payload",
        void 0
      );
      exports.ReplyTask = ReplyTask;

      /***/
    },

    /***/ "@nestjs/common": /***/ (module) => {
      module.exports = require("@nestjs/common");

      /***/
    },

    /***/ "@nestjs/core": /***/ (module) => {
      module.exports = require("@nestjs/core");

      /***/
    },

    /***/ "@nestjs/swagger": /***/ (module) => {
      module.exports = require("@nestjs/swagger");

      /***/
    },

    /***/ "@rmp135/imgur": /***/ (module) => {
      module.exports = require("@rmp135/imgur");

      /***/
    },

    /***/ amqplib: /***/ (module) => {
      module.exports = require("amqplib");

      /***/
    },

    /***/ "class-validator": /***/ (module) => {
      module.exports = require("class-validator");

      /***/
    },

    /***/ express: /***/ (module) => {
      module.exports = require("express");

      /***/
    },

    /***/ "playwright-core": /***/ (module) => {
      module.exports = require("playwright-core");

      /***/
    },

    /***/ tslib: /***/ (module) => {
      module.exports = require("tslib");

      /***/
    },

    /***/ crypto: /***/ (module) => {
      module.exports = require("crypto");

      /***/
    },

    /***/ fs: /***/ (module) => {
      module.exports = require("fs");

      /***/
    },

    /***/ path: /***/ (module) => {
      module.exports = require("path");

      /***/
    },

    /***/ util: /***/ (module) => {
      module.exports = require("util");

      /***/
    },

    /***/ zlib: /***/ (module) => {
      module.exports = require("zlib");

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    var exports = __webpack_exports__;

    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = __webpack_require__("tslib");
    const app_module_1 = __webpack_require__(
      "./apps/robots/robot-actions/src/app/app.module.ts"
    );
    const script_module_1 = __webpack_require__(
      "./apps/robots/robot-actions/src/app/script/script.module.ts"
    );
    const shared_1 = __webpack_require__("./libs/views/shared/src/index.ts");
    const core_1 = __webpack_require__("@nestjs/core");
    function run() {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const module = yield core_1.NestFactory.create(app_module_1.AppModule);
        console.log("close");
        const app = yield module.get(script_module_1.APPLICATION_PROVIDER);
        app.setApplicationId(1);
        yield app.executeTask({
          action: shared_1.TaskEnum.AUTHENTICATION,
          applicationId: 1,
          email: {
            email: "leaderiop@gmail.com",
            confirmationEmail: "",
            password: "shinobios1234",
            session: "",
          },
          id: 1,
          emailId: 1,
          isp: shared_1.IspEnum.GMAIL,
          jobId: 1,
          payload: {},
        });
        //   console.log(result);
        module.enableShutdownHooks();
        yield module.close();
        setInterval(() => {
          console.log("Ping after 5s");
        }, 5000);
      });
    }
    run();
  })();

  var __webpack_export_target__ = exports;
  for (var i in __webpack_exports__)
    __webpack_export_target__[i] = __webpack_exports__[i];
  if (__webpack_exports__.__esModule)
    Object.defineProperty(__webpack_export_target__, "__esModule", {
      value: true,
    });
  /******/
})();
//# sourceMappingURL=main.js.map
