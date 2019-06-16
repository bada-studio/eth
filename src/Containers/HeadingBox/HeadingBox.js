import React, {Component} from 'react';
import { RegisterBox } from '../../Components';
import { NoticeBox } from '../../Containers';
import { Image } from 'semantic-ui-react';
import Alert from 'react-s-alert';
import accountService from '../../Services/AccountService';
import title from './../../Images/title.png';
import './HeadingBox.css';

class HeadingBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: accountService.account,
      oauth: accountService.oauth,
      mobile: "",
      smsAgree: false
    };

    accountService.ee.on('updated', this.onAccountUpdated);
  }

  onAccountUpdated = () => {
    console.log(accountService.oauth);
    this.setState({
      account: accountService.account,
      oauth: accountService.oauth,
    });
  };

  onClickLogin = async() => {
    accountService.kakaoSignup();
  };

  onClickRegister = async() => {
    let mobile = this.state.mobile;
    if (mobile.length < 7) {
      this.showAlert(false,"핸드폰 번호를 확인해 주세요.");
      return;
    }

    if (!this.state.smsAgree) {
      this.showAlert(false,"개인 정보 사용 및 SMS 수신에 동의해주세요.");
      return;
    }

    let account = await accountService.preRegister(mobile);
    if (account == null) {
      this.showAlert(false,"사전 등록 실패");
    } else {
      this.showAlert(true,"사전 등록 성공!");
    }
  };

  onClickLogout = async() => {
    accountService.clearAuth();
  };

  onClickNotice = async() => {
    NoticeBox.show();
  };

  onChangeInput = (e) => {
    const val = e.target.value;

    if (e.target.validity.valid) {
      this.setState({
        [e.target.name]: e.target.value
      })
    } else if (val === '' || val === '-') {
      this.setState({
        [e.target.name]: val
      })
    }
  };

  onChangeCheckbox = (event: React.FormEvent<HTMLInputElement>, data) => {
    this.setState({ [data.name]: data.checked });
  };

  showAlert(success, message) {
    let config = {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: 3000
    };

    if (success) {
      Alert.success(message, config);
    } else {
      Alert.error(message, config);
    }
  }

  render() {
    const {
      account,
      oauth,
      mobile,
      smsAgree
    } = this.state;

    return (
      <div className="HeadingBox">
        <Image src={title} className="TitleIcon centered"/>
        <RegisterBox
          account = {account}
          oauth = {oauth}
          mobile = {mobile}
          smsAgree = {smsAgree}
          onChangeInput = {this.onChangeInput}
          onChangeCheckbox = {this.onChangeCheckbox}
          onClickLogin = {this.onClickLogin}
          onClickLogout = {this.onClickLogout}
          onClickNotice = {this.onClickNotice}
          onClickRegister = {this.onClickRegister}
        />
      </div>
    );
  }
}

export default HeadingBox;