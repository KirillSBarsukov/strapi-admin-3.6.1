/**
 *
 * Admin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
// Components from strapi-helper-plugin
import {
  difference,
  GlobalContextProvider,
  LoadingIndicatorPage,
  OverlayBlocker,
  CheckPagePermissions,
  request,
} from 'strapi-helper-plugin';
import { SETTINGS_BASE_URL, SHOW_TUTORIALS, STRAPI_UPDATE_NOTIF } from '../../config';
import { checkLatestStrapiVersion } from '../../utils';

import adminPermissions from '../../permissions';
import Header from '../../components/Header/index';
import NavTopRightWrapper from '../../components/NavTopRightWrapper';
import LeftMenu from '../LeftMenu';
import InstalledPluginsPage from '../InstalledPluginsPage';
import HomePage from '../HomePage';
import MarketplacePage from '../MarketplacePage';
import NotFoundPage from '../NotFoundPage';
import OnboardingVideos from '../Onboarding';
import PermissionsManager from '../PermissionsManager';
import PluginDispatcher from '../PluginDispatcher';
import ProfilePage from '../ProfilePage';
import SettingsPage from '../SettingsPage';
import Logout from './Logout';
import {
  disableGlobalOverlayBlocker,
  enableGlobalOverlayBlocker,
  getInfosDataSucceeded,
  updatePlugin,
} from '../App/actions';
import makeSelecApp from '../App/selectors';
import { getStrapiLatestReleaseSucceeded, setAppError } from './actions';
import makeSelectAdmin from './selectors';
import Wrapper from './Wrapper';
import Content from './Content';

export class Admin extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  // This state is really temporary until we create a menu API
  state = { updateMenu: null };

  helpers = {
    updatePlugin: this.props.updatePlugin,
  };

  componentDidMount() {
    this.emitEvent('didAccessAuthenticatedAdministration');
    this.initApp();
  }

  shouldComponentUpdate(prevProps, prevState) {
    return !isEmpty(difference(prevProps, this.props)) || !isEmpty(prevState, this.state);
  }

  /* istanbul ignore next */
  componentDidCatch(error, info) {
    /* eslint-disable */
    console.log('An error has occured');
    console.log('--------------------');
    console.log(error);
    console.log('Here is some infos');
    console.log(info);
    /* eslint-enable */

    // Display the error log component which is not designed yet
    this.props.setAppError();
  }

  emitEvent = async (event, properties) => {
    const {
      global: { uuid },
    } = this.props;

    if (uuid) {
      try {
        // await axios.post('https://analytics.strapi.io/track', {
        //   event,
        //   // PROJECT_TYPE is an env variable defined in the webpack config
        //   // eslint-disable-next-line no-undef
        //   properties: { ...properties, projectType: PROJECT_TYPE },
        //   uuid,
        // });
      } catch (err) {
        // Silent
      }
    }
  };

  fetchAppInfo = async () => {
    try {
      const { data } = await request('/admin/information', { method: 'GET' });

      this.props.getInfosDataSucceeded(data);
    } catch (err) {
      console.error(err);
      strapi.notification.error('notification.error');
    }
  };

  fetchStrapiLatestRelease = async () => {
    const {
      global: { strapiVersion },
      getStrapiLatestReleaseSucceeded,
    } = this.props;

    if (!STRAPI_UPDATE_NOTIF) {
      return;
    }

    try {
      // const {
      //   data: { tag_name },
      // } = await axios.get('https://api.github.com/repos/strapi/strapi/releases/latest');
      // const shouldUpdateStrapi = checkLatestStrapiVersion(strapiVersion, tag_name);

      const tag_name = {
        "url": "https://api.github.com/repos/strapi/strapi/releases/42759391",
        "assets_url": "https://api.github.com/repos/strapi/strapi/releases/42759391/assets",
        "upload_url": "https://uploads.github.com/repos/strapi/strapi/releases/42759391/assets{?name,label}",
        "html_url": "https://github.com/strapi/strapi/releases/tag/v3.6.1",
        "id": 42759391,
        "author": {
          "login": "alexandrebodin",
          "id": 6065744,
          "node_id": "MDQ6VXNlcjYwNjU3NDQ=",
          "avatar_url": "https://avatars.githubusercontent.com/u/6065744?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/alexandrebodin",
          "html_url": "https://github.com/alexandrebodin",
          "followers_url": "https://api.github.com/users/alexandrebodin/followers",
          "following_url": "https://api.github.com/users/alexandrebodin/following{/other_user}",
          "gists_url": "https://api.github.com/users/alexandrebodin/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/alexandrebodin/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/alexandrebodin/subscriptions",
          "organizations_url": "https://api.github.com/users/alexandrebodin/orgs",
          "repos_url": "https://api.github.com/users/alexandrebodin/repos",
          "events_url": "https://api.github.com/users/alexandrebodin/events{/privacy}",
          "received_events_url": "https://api.github.com/users/alexandrebodin/received_events",
          "type": "User",
          "site_admin": false
        },
        "node_id": "MDc6UmVsZWFzZTQyNzU5Mzkx",
        "tag_name": "v3.6.1",
        "target_commitish": "master",
        "name": "v3.6.1",
        "draft": false,
        "prerelease": false,
        "created_at": "2021-05-11T09:43:36Z",
        "published_at": "2021-05-11T09:45:06Z",
        "assets": [],
        "tarball_url": "https://api.github.com/repos/strapi/strapi/tarball/v3.6.1",
        "zipball_url": "https://api.github.com/repos/strapi/strapi/zipball/v3.6.1",
        "body": "### 💅 Enhancement\r\n\r\n* [plugin:graphql] GraphQL Plugin (bug): Content type's attributes marked as private are being exposed in the exported GraphQL schema (https://github.com/strapi/strapi/pull/9805) @ralphsomeday\r\n* [plugin:i18n] Make listLocales route available for non-admin (https://github.com/strapi/strapi/pull/10255) @petersg83\r\n* [plugin:upload] Keep metadata during image resize (Media Library) (https://github.com/strapi/strapi/pull/10161) @Kendaros\r\n\r\n### 🌏 Translation\r\n\r\n* [admin] Added norwegian translation. (https://github.com/strapi/strapi/pull/9846) @ksolberg\r\n* [admin] Update strapi-admin Polish language translations (https://github.com/strapi/strapi/pull/10198) @Webnatural\r\n* [admin] Removed extra space (https://github.com/strapi/strapi/pull/10203) @cogor\r\n* [admin] Update German strapi-admin translations (https://github.com/strapi/strapi/pull/10207) @pr0gr8mm3r\r\n* [plugin:content-manager] Added missing translations (https://github.com/strapi/strapi/pull/10202) @cogor\r\n* [plugin:content-type-builder] Added missing translation(content type builder) (https://github.com/strapi/strapi/pull/10204) @cogor\r\n* [plugin:documentation] Added missing translations(Documentation plugin) (https://github.com/strapi/strapi/pull/10205) @cogor\r\n\r\n### 🐛 Bug fix\r\n\r\n* [core:framework] Fix RBAC conditions (https://github.com/strapi/strapi/pull/10185) @Convly\r\n* [core:database] Fix compatibility issue for mongo < 4.2 (https://github.com/strapi/strapi/pull/10281) @Convly\r\n* [plugin:content-manager] Fix date field being parsed with a timezone (https://github.com/strapi/strapi/pull/10033) @derrickmehaffy\r\n* [plugin:content-type-builder] Fixes #10187 (https://github.com/strapi/strapi/pull/10193) @soupette\r\n* [plugin:content-type-builder] Removing positive requirement of integer validation (https://github.com/strapi/strapi/pull/10269) @multiwebinc\r\n\r\n---\r\n### 📚  Migration guides can be found [here](https://strapi.io/documentation/developer-docs/latest/update-migration-guides/migration-guides.html) 📚 "
      }

      getStrapiLatestReleaseSucceeded(tag_name, shouldUpdateStrapi);

      const showUpdateNotif = !JSON.parse(localStorage.getItem('STRAPI_UPDATE_NOTIF'));

      if (!showUpdateNotif) {
        return;
      }

      if (shouldUpdateStrapi) {
        strapi.notification.toggle({
          type: 'info',
          message: { id: 'notification.version.update.message' },
          link: {
            url: `https://github.com/strapi/strapi/releases/tag/${tag_name}`,
            label: {
              id: 'notification.version.update.link',
            },
          },
          blockTransition: true,
          onClose: () => localStorage.setItem('STRAPI_UPDATE_NOTIF', true),
        });
      }
    } catch (err) {
      // Silent
    }
  };

  hasApluginNotReady = props => {
    const {
      global: { plugins },
    } = props;

    return !Object.keys(plugins).every(plugin => plugins[plugin].isReady === true);
  };

  initApp = async () => {
    await this.fetchAppInfo();
    await this.fetchStrapiLatestRelease();
  };

  /**
   * Display the app loader until the app is ready
   * @returns {Boolean}
   */
  showLoader = () => {
    return this.hasApluginNotReady(this.props);
  };

  renderInitializers = () => {
    const {
      global: { plugins },
    } = this.props;

    return Object.keys(plugins).reduce((acc, current) => {
      const InitializerComponent = plugins[current].initializer;

      if (InitializerComponent) {
        const key = plugins[current].id;

        acc.push(<InitializerComponent key={key} {...this.props} {...this.helpers} />);
      }

      return acc;
    }, []);
  };

  renderPluginDispatcher = props => {
    // NOTE: Send the needed props instead of everything...

    return <PluginDispatcher {...this.props} {...props} {...this.helpers} />;
  };

  renderRoute = (props, Component) => <Component {...this.props} {...props} />;

  setUpdateMenu = updateMenuFn => {
    this.setState({ updateMenu: updateMenuFn });
  };

  render() {
    const {
      admin: { shouldUpdateStrapi },
      global: {
        autoReload,
        blockApp,
        currentEnvironment,
        overlayBlockerData,
        plugins,
        showGlobalAppBlocker,
        strapiVersion,
      },
      disableGlobalOverlayBlocker,
      enableGlobalOverlayBlocker,
      intl: { formatMessage, locale },
      updatePlugin,
    } = this.props;

    // We need the admin data in order to make the initializers work
    if (this.showLoader()) {
      return (
        <>
          {this.renderInitializers()}
          <LoadingIndicatorPage />
        </>
      );
    }

    return (
      <PermissionsManager>
        <GlobalContextProvider
          autoReload={autoReload}
          emitEvent={this.emitEvent}
          currentEnvironment={currentEnvironment}
          currentLocale={locale}
          disableGlobalOverlayBlocker={disableGlobalOverlayBlocker}
          enableGlobalOverlayBlocker={enableGlobalOverlayBlocker}
          formatMessage={formatMessage}
          shouldUpdateStrapi={shouldUpdateStrapi}
          plugins={plugins}
          settingsBaseURL={SETTINGS_BASE_URL || '/settings'}
          strapiVersion={strapiVersion}
          updatePlugin={updatePlugin}
          updateMenu={this.state.updateMenu}
        >
          <Wrapper>
            <LeftMenu
              shouldUpdateStrapi={shouldUpdateStrapi}
              version={strapiVersion}
              plugins={plugins}
              setUpdateMenu={this.setUpdateMenu}
            />
            <NavTopRightWrapper>
              {/* Injection zone not ready yet */}
              <Logout />
            </NavTopRightWrapper>
            <div className="adminPageRightWrapper">
              <Header />
              <Content>
                <Switch>
                  <Route path="/" render={props => this.renderRoute(props, HomePage)} exact />
                  <Route path="/me" component={ProfilePage} />
                  <Route path="/plugins/:pluginId" render={this.renderPluginDispatcher} />
                  <Route path="/list-plugins" exact>
                    <CheckPagePermissions permissions={adminPermissions.marketplace.main}>
                      <InstalledPluginsPage />
                    </CheckPagePermissions>
                  </Route>
                  <Route path="/marketplace">
                    <CheckPagePermissions permissions={adminPermissions.marketplace.main}>
                      <MarketplacePage />
                    </CheckPagePermissions>
                  </Route>
                  <Route
                    path={`${SETTINGS_BASE_URL || '/settings'}/:settingId`}
                    component={SettingsPage}
                  />
                  <Route path={SETTINGS_BASE_URL || '/settings'} component={SettingsPage} exact />
                  <Route key="7" path="" component={NotFoundPage} />
                  <Route key="8" path="/404" component={NotFoundPage} />
                </Switch>
              </Content>
            </div>
            <OverlayBlocker
              key="overlayBlocker"
              isOpen={blockApp && showGlobalAppBlocker}
              {...overlayBlockerData}
            />
            {SHOW_TUTORIALS && <OnboardingVideos />}
          </Wrapper>
        </GlobalContextProvider>
      </PermissionsManager>
    );
  }
}

Admin.defaultProps = {
  intl: {
    formatMessage: () => {},
    locale: 'en',
  },
};

Admin.propTypes = {
  admin: PropTypes.shape({
    appError: PropTypes.bool,
    shouldUpdateStrapi: PropTypes.bool.isRequired,
  }).isRequired,
  disableGlobalOverlayBlocker: PropTypes.func.isRequired,
  enableGlobalOverlayBlocker: PropTypes.func.isRequired,
  getInfosDataSucceeded: PropTypes.func.isRequired,
  getStrapiLatestReleaseSucceeded: PropTypes.func.isRequired,
  global: PropTypes.shape({
    autoReload: PropTypes.bool,
    blockApp: PropTypes.bool,
    currentEnvironment: PropTypes.string,
    overlayBlockerData: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    plugins: PropTypes.object,
    showGlobalAppBlocker: PropTypes.bool,
    strapiVersion: PropTypes.string,
    uuid: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
    locale: PropTypes.string,
  }),
  location: PropTypes.object.isRequired,
  setAppError: PropTypes.func.isRequired,
  updatePlugin: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  admin: makeSelectAdmin(),
  global: makeSelecApp(),
});

export function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      disableGlobalOverlayBlocker,
      enableGlobalOverlayBlocker,
      getInfosDataSucceeded,
      getStrapiLatestReleaseSucceeded,
      setAppError,
      updatePlugin,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, withConnect)(Admin);
