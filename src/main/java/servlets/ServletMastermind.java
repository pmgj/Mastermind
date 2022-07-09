package servlets;

import java.io.IOException;
import java.util.stream.Collectors;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Mastermind;
import model.ResponseMessage;

@WebServlet(name = "ServletMastermind", urlPatterns = {"/ServletMastermind"})
@MultipartConfig
public class ServletMastermind extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Integer numOfColors = Integer.parseInt(request.getParameter("numberOfColors"));
        Integer numOfCodes = Integer.parseInt(request.getParameter("numberOfCodes"));
        Integer numOfTries = Integer.parseInt(request.getParameter("numberOfTries"));
        Mastermind m = new Mastermind(numOfColors, numOfTries, numOfCodes);
        session.setAttribute("mastermind", m);
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        int[] code = JsonbBuilder.create().fromJson(body, int[].class);
        HttpSession session = request.getSession();
        Mastermind m = (Mastermind) session.getAttribute("mastermind");
        ResponseMessage msg = m.testCode(code);
        response.setContentType("application/json");
        String json = JsonbBuilder.create().toJson(msg);
        response.getWriter().print(json);
    }
}
