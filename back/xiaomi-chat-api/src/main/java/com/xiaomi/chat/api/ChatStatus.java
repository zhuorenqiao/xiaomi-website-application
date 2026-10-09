package com.xiaomi.chat.api;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 数据块状态，对应协议中的 status 字段。
 */
public enum ChatStatus {

    /** 正常数据 */
    SUCCESS("success"),
    /** 服务端异常（前端据此展示错误态并允许重新生成） */
    ERROR("error");

    private final String value;

    ChatStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ChatStatus from(String value) {
        for (ChatStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知状态: " + value);
    }
}
