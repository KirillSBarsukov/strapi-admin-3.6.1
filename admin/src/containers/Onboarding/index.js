import React, { useEffect, useReducer, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import { useGlobalContext } from 'strapi-helper-plugin';

import formatVideoArray from './utils/formatAndStoreVideoArray';

import StaticLinks from './StaticLinks';
import Video from './Video';
import Wrapper from './Wrapper';
import init from './init';
import reducer, { initialState } from './reducer';

const OnboardingVideos = () => {
  const { emitEvent } = useGlobalContext();
  const [reducerState, dispatch] = useReducer(reducer, initialState, init);
  const { isLoading, isOpen, videos } = reducerState.toJS();

  useEffect(() => {
    const getData = async () => {
      try {
        // const { data } = await axios.get('https://strapi.io/videos', {
        //   timeout: 1000,
        // });
        const data = [
          {
            "id": 1,
            "title": "Create your first content-type",
            "video": "https://s3-us-west-2.amazonaws.com/strapi-video-help/create-first-content-type.mp4",
            "preview": "https://s3-us-west-2.amazonaws.com/strapi-video-help/create-first-content-type.png",
            "published": true,
            "order": 0,
            "created_at": "2020-05-18T15:49:01.080Z",
            "updated_at": "2020-05-18T15:49:01.080Z"
          },
          {
            "id": 2,
            "title": "Fill your content with data",
            "video": "https://s3-us-west-2.amazonaws.com/strapi-video-help/fill-data.mp4",
            "preview": "https://s3-us-west-2.amazonaws.com/strapi-video-help/fill-data.png",
            "published": true,
            "order": 1,
            "created_at": "2020-05-18T15:49:21.503Z",
            "updated_at": "2020-05-18T15:49:21.503Z"
          },
          {
            "id": 3,
            "title": "Fetch data through the API",
            "video": "https://s3-us-west-2.amazonaws.com/strapi-video-help/access-fetch-api.mp4",
            "preview": "https://s3-us-west-2.amazonaws.com/strapi-video-help/access-fetch-api.png",
            "published": true,
            "order": 2,
            "created_at": "2020-05-18T15:49:46.449Z",
            "updated_at": "2020-05-18T15:49:46.449Z"
          }
        ]
        const { didWatchVideos, videos } = formatVideoArray(data);

        dispatch({
          type: 'GET_DATA_SUCCEEDED',
          didWatchVideos,
          videos,
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'HIDE_VIDEO_ONBOARDING',
        });
      }
    };

    getData();
  }, []);

  // Hide the player in case of request error
  if (isLoading) {
    return null;
  }

  const handleClick = () => {
    const eventName = isOpen
      ? 'didOpenGetStartedVideoContainer'
      : 'didCloseGetStartedVideoContainer';

    dispatch({ type: 'SET_IS_OPEN' });
    emitEvent(eventName);
  };
  const handleClickOpenVideo = videoIndexToOpen => {
    dispatch({
      type: 'TOGGLE_VIDEO_MODAL',
      videoIndexToOpen,
    });
  };
  const handleUpdateVideoStartTime = (videoIndex, elapsedTime) => {
    dispatch({
      type: 'UPDATE_VIDEO_STARTED_TIME_AND_PLAYED_INFOS',
      videoIndex,
      elapsedTime,
    });
  };
  const setVideoDuration = (videoIndex, duration) => {
    dispatch({
      type: 'SET_VIDEO_DURATION',
      duration,
      videoIndex,
    });
  };

  const hasVideos = videos.length > 0;
  const className = hasVideos ? 'visible' : 'hidden';

  return null;
};

export default memo(OnboardingVideos);
