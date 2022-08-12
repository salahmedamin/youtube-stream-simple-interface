import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  buffer: PropTypes.object.isRequired,
  color: PropTypes.string,
  height: PropTypes.number,
  maxDuration: PropTypes.number,
  sampleThreeshold: PropTypes.number,
  startTime: PropTypes.number,
  width: PropTypes.number
};

const defaultProps = {
  color: "rgb(0,0,0,0.6)",
  height: 200,
  maxDuration: 10,
  sampleThreeshold: 5,
  startTime: 0,
  width: 800
};

class AudioGraph extends React.Component {
  componentDidMount() {
    this.samples = this._prepareSamples();
    this._drawWaveForm();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.maxDuration != this.props.maxDuration ||
      prevProps.width != this.props.width ||
      prevProps.buffer != this.props.buffer
    ) {
      this.samples = this._prepareSamples();
    }
    this._drawWaveForm();
  }

  _drawWaveForm() {
    var middle = this.props.height / 2;
    var canvas = this.refs.canvas;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.props.color;
    var sampleStep = Math.ceil(
      (this.props.maxDuration * this.props.buffer.sampleRate) / this.props.width
    );
    var samplePerSecond = Math.round(this.props.buffer.sampleRate / sampleStep);
    var timeThreeshold = Math.round(this.props.startTime * samplePerSecond);
    for (var i = 0; i < this.samples.length; i += 1) {
      var sample = this.samples[i + timeThreeshold];
      ctx.fillRect(i, middle - sample * middle, 1, sample * this.props.height);
    }
  }

  _prepareSamples() {
    var sampleStep = Math.ceil(
      (this.props.maxDuration * this.props.buffer.sampleRate) / this.props.width
    );
    var sampleThreeshold = this.props.sampleThreeshold;
    var data = this.props.buffer.getChannelData(0);
    var samples = [];
    var currentIndex = 0;
    var channelDataLength = data.length;
    var sampleThreesholdStep = Math.ceil(sampleStep / (sampleThreeshold + 2));
    do {
      samples.push(
        this._calculateAvgSample(
          data,
          currentIndex,
          sampleStep,
          sampleThreeshold,
          sampleThreesholdStep
        )
      );
      currentIndex += sampleStep;
    } while (currentIndex < channelDataLength);
    return samples;
  }

  _calculateAvgSample(
    data,
    currentIndex,
    sampleStep,
    sampleThreeshold,
    sampleThreesholdStep
  ) {
    var sum = 0;
    var sampleCount = 0;
    for (var i = -sampleThreeshold - 1; i <= sampleThreeshold + 1; i += 1) {
      var currentSample = data[currentIndex + i * sampleThreeshold];
      if (currentSample != undefined) {
        sum += currentSample;
        sampleCount += 1;
      }
    }
    return sum / sampleCount;
  }

  render() {
    const styles = this.props.styles || {};

    return (
      <div>
        {this.props.label && (
          <label style={styles.label}>{this.props.label}</label>
        )}
        <canvas
          ref="canvas"
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

AudioGraph.propTypes = propTypes;
AudioGraph.defaultProps = defaultProps;

export default AudioGraph;
