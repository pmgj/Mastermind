package rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import model.Mastermind;
import model.ResponseMessage;

@Path("mastermind")
public class GenericResource {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void newGame(@Context HttpServletRequest request, StartMessage values) {
        Integer numOfColors = values.getNumberOfColors();
        Integer numOfTries = values.getNumberOfTries();
        Integer numOfCodes = values.getNumberOfCodes();
        Mastermind m = new Mastermind(numOfColors, numOfTries, numOfCodes);
        HttpSession session = request.getSession();
        session.setAttribute("mastermind", m);
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseMessage checkCode(@Context HttpServletRequest request, int[] code) {
        HttpSession session = request.getSession();
        Mastermind m = (Mastermind) session.getAttribute("mastermind");
        return m.testCode(code);
    }    
}
