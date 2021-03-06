/**
 * Copyright 2018 Shift Devices AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, h } from 'preact';
import { translate } from 'react-i18next';
import { apiPost } from '../../../utils/request';
import { PasswordRepeatInput } from '../../../components/password';
import { Button } from '../../../components/forms';
import { Message } from '../../../components/message/message';
import { Shift } from '../../../components/icon/logo';
import Footer from '../../../components/footer/footer';
import Spinner from '../../../components/spinner/Spinner';
import { Steps, Step } from './components/steps';
import * as style from '../device.css';

const stateEnum = Object.freeze({
    DEFAULT: 'default',
    WAITING: 'waiting',
    ERROR: 'error'
});

@translate()
export default class Initialize extends Component {
    state = {
        showInfo: true,
        password: null,
        status: stateEnum.DEFAULT,
        errorCode: null,
        errorMessage: '',
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.password) {
            return;
        }
        this.setState({
            status: stateEnum.WAITING,
            errorCode: null,
            errorMessage: ''
        });
        apiPost('devices/' + this.props.deviceID + '/set-password', {
            password: this.state.password
        }).then(data => {
            if (!data.success) {
                if (data.code) {
                    this.setState({ errorCode: data.code });
                }
                this.setState({
                    status: stateEnum.ERROR,
                    errorMessage: data.errorMessage
                });
            }
            if (this.passwordInput) {
                this.passwordInput.getWrappedInstance().clear();
            }
        });
    };

    setValidPassword = password => {
        this.setState({ password });
    }

    handleStart = () => {
        this.setState({ showInfo: false });
    }

    render({
        t,
        goal,
        goBack,
    }, {
        showInfo,
        password,
        status,
        errorCode,
        errorMessage,
    }) {

        let formSubmissionState = null;

        switch (status) {
        case stateEnum.DEFAULT:
            formSubmissionState = null;
            break;
        case stateEnum.WAITING:
            formSubmissionState = <Message type="info">{t('initialize.creating')}</Message>;
            break;
        case stateEnum.ERROR:
            formSubmissionState = (
                <Message type="error">
                    {t(`initialize.error.e${errorCode}`, {
                        defaultValue: errorMessage
                    })}
                </Message>
            );
        }

        const content = showInfo ? (
            <div className={style.block}>
                <div class="subHeaderContainer first">
                    <div class="subHeader">
                        <h3>{t('initialize.info.subtitle')}</h3>
                    </div>
                </div>
                <ul>
                    <li>{t('initialize.info.description1')}</li>
                    <li>{t('initialize.info.description2')}</li>
                </ul>
                <p>{t('initialize.info.description3')}</p>
                <div className={['buttons flex flex-row flex-between', style.buttons].join(' ')}>
                    <Button
                        secondary
                        onClick={goBack}>
                        {t('button.back')}
                    </Button>
                    <Button primary onClick={this.handleStart}>
                        {t('initialize.info.button')}
                    </Button>
                </div>
            </div>
        ) : (
            <form onSubmit={this.handleSubmit} class="flex-1">
                <PasswordRepeatInput
                    pattern="^.{4,}$"
                    label={t('initialize.input.label')}
                    repeatLabel={t('initialize.input.labelRepeat')}
                    repeatPlaceholder={t('initialize.input.placeholderRepeat')}
                    ref={ref => this.passwordInput = ref}
                    disabled={status === stateEnum.WAITING}
                    onValidPassword={this.setValidPassword} />
                <div className={['buttons flex flex-row flex-between', style.buttons].join(' ')}>
                    <Button
                        secondary
                        onClick={goBack}>
                        {t('button.back')}
                    </Button>
                    <Button
                        type="submit"
                        primary
                        disabled={!password || status === stateEnum.WAITING}>
                        {t('initialize.create')}
                    </Button>
                </div>
            </form>
        );

        return (
            <div class="contentWithGuide">
                <div className={style.container}>
                    <div className={style.content}>
                        <Steps current={1}>
                            <Step title={t('goal.step.1.title')} />
                            <Step divider />
                            <Step title={t('goal.step.2.title')} description={t('goal.step.2.description')} />
                            <Step divider />
                            <Step title={t(`goal.step.3-${goal}.title`)} description={t(`goal.step.3-${goal}.description`)} />
                            <Step divider />
                            <Step title={t(`goal.step.4-${goal}.title`)} />
                        </Steps>
                        <hr />
                        {formSubmissionState}
                        <h1 className={style.title}>{t(showInfo ? 'initialize.info.title' : 'setup')}</h1>
                        {content}
                        <hr />
                        <Footer>
                            <Shift />
                        </Footer>
                    </div>
                    {
                        status === stateEnum.WAITING && (
                            <Spinner text={t('initialize.creating')} showLogo />
                        )
                    }
                </div>
            </div>
        );
    }
}
