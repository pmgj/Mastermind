package model;

import java.util.List;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ResponseMessage {
    private State state;
    private List<Integer> code;
    private List<Integer> password;

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public List<Integer> getCode() {
        return code;
    }

    public void setCode(List<Integer> code) {
        this.code = code;
    }

    public List<Integer> getPassword() {
        return password;
    }

    public void setPassword(List<Integer> password) {
        this.password = password;
    }
}
