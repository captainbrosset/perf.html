import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import TabBar from '../components/TabBar';
import ProfileSummaryView from '../containers/ProfileSummaryView';
import ProfileCallTreeView from '../containers/ProfileCallTreeView';
import ProfileMarkersView from '../containers/ProfileMarkersView';
import ProfileTaskTracerView from '../containers/ProfileTaskTracerView';
import ProfileLogView from '../containers/ProfileLogView';
import ProfileFilterNavigator from '../containers/ProfileFilterNavigator';
import ProfileSharing from '../containers/ProfileSharing';
import SymbolicationStatusOverlay from '../containers/SymbolicationStatusOverlay';
import TimelineView from '../containers/TimelineView';
import actions from '../actions';
import { getProfileViewOptions, getDisplayRange } from '../reducers/profile-view';
import { getSelectedTab } from '../reducers/url-state';
import ProfileViewerHeader from '../containers/ProfileViewerHeader';
import ProfileCallTreeContextMenu from '../containers/ProfileCallTreeContextMenu';
import ProfileThreadHeaderContextMenu from '../containers/ProfileThreadHeaderContextMenu';

class ProfileViewer extends PureComponent {
  constructor(props) {
    super(props);
    this._onSelectTab = this._onSelectTab.bind(this);

    // If updating this list, make sure and update the tabOrder reducer with another index.
    this._tabs = [
      {
        name: 'summary',
        title: 'Summary',
      },
      {
        name: 'calltree',
        title: 'Call Tree',
      },
      {
        name: 'markers',
        title: 'Markers',
      },
      {
        name: 'tasktracer',
        title: 'Task Tracer',
      },
      {
        name: 'log',
        title: 'Log',
      },
      {
        name: 'timeline',
        title: 'Timeline',
      },
    ];
  }

  _onSelectTab(selectedTab) {
    const { changeSelectedTab } = this.props;
    changeSelectedTab(selectedTab);
  }

  render() {
    const {
      className, tabOrder, timeRange, changeTabOrder, selectedTab,
    } = this.props;

    return (
      <div className={className}>
        <div className={`${className}TopBar`}>
          <ProfileFilterNavigator />
          <ProfileSharing />
        </div>
        <ProfileViewerHeader />
        <TabBar tabs={this._tabs}
                selectedTabName={selectedTab}
                tabOrder={tabOrder}
                onSelectTab={this._onSelectTab}
                onChangeTabOrder={changeTabOrder} />
        {{
          summary: <ProfileSummaryView />,
          calltree: <ProfileCallTreeView />,
          markers: <ProfileMarkersView />,
          tasktracer: <ProfileTaskTracerView rangeStart={timeRange.start} rangeEnd={timeRange.end} />,
          timeline: <TimelineView />,
          log: <ProfileLogView />,
        }[selectedTab]}
        <SymbolicationStatusOverlay />
        <ProfileCallTreeContextMenu />
        <ProfileThreadHeaderContextMenu />
      </div>
    );
  }
}

ProfileViewer.propTypes = {
  className: PropTypes.string.isRequired,
  tabOrder: PropTypes.arrayOf(PropTypes.number).isRequired,
  timeRange: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  changeSelectedTab: PropTypes.func.isRequired,
  changeTabOrder: PropTypes.func.isRequired,
};

export default connect(state => ({
  tabOrder: getProfileViewOptions(state).tabOrder,
  selectedTab: getSelectedTab(state),
  className: 'profileViewer',
  timeRange: getDisplayRange(state),
}), actions)(ProfileViewer);
