package com.springframework.hoxify.controller;

import com.springframework.hoxify.error.ApiError;
import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.UserRepository;
import com.springframework.hoxify.repository.HoxRepository;
import com.springframework.hoxify.service.HoxService;
import com.springframework.hoxify.service.UserService;
import com.springframework.hoxify.tools.TestPage;
import com.springframework.hoxify.tools.TestTools;
import com.springframework.hoxify.view.HoxVM;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 1:52 PM
*/

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class HoxControllerTest {

    public static final String API_1_0_HOXES = "/api/1.0/hoxes";
    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    HoxService hoxService;

    @Autowired
    HoxRepository hoxRepository;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @Before
    public void cleanup() {
        hoxRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    private void authenticate(String username) {
        testRestTemplate
                .getRestTemplate()
                .getInterceptors()
                .add(new BasicAuthenticationInterceptor(username, TestTools.TEST_PASSWORD));
    }

    private <T> ResponseEntity<T> postHOX(Hox hox, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_HOXES, hox, responseType);
    }

    private <T> ResponseEntity<T> getHoxes(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_1_0_HOXES, HttpMethod.GET, null, responseType);
    }

    // POST

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsUnauthorized_receiveUnauthorized() {
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    public void postHOX_whenHOXIsValidAndUserIsUnauthorized_receiveAPIError() {
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<ApiError> responseEntity = postHOX(hox, ApiError.class);
        assertThat(responseEntity.getBody().getStatus())
                .isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXSavedToDataBase() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);
        assertThat(hoxRepository.count()).isEqualTo(1);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXSavedToDataBaseWithTimestamp() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);

        Hox hoxInDB = hoxRepository.findAll().get(0);
        assertThat(hoxInDB.getTimestamp()).isNotNull();
    }

    @Test
    public void postHOX_whenHOXContentNullAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postHOX_whenHOXContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        hox.setContent("123456789");
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postHOX_whenHOXContentIs5000CharactersAndUserIsAuthorized_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        String fiveThousandChars = IntStream
                .rangeClosed(1, 5000)
                .mapToObj(i -> "x")
                .collect(Collectors.joining());
        hox.setContent(fiveThousandChars);
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postHOX_whenHOXContentIsMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        String fiveThousandChars = IntStream.rangeClosed(1, 5002)
                .mapToObj(i -> "x")
                .collect(Collectors.joining());
        hox.setContent(fiveThousandChars);
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postHOX_whenHOXContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        ResponseEntity<ApiError> responseEntity = postHOX(hox, ApiError.class);
        Map<String, String> validationErrors = responseEntity.getBody().getValidationErrors();
        assertThat(validationErrors.get("content")).isNotNull();
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXSavedWithAuthenticatedUserInformation() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);

        Hox hoxInDB = hoxRepository.findAll().get(0);
        assertThat(hoxInDB.getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXCanBeAccessedFromUserEntity() {
        User user = userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);

        EntityManager entityManager = entityManagerFactory.createEntityManager();

        User userInDB = entityManager.find(User.class, user.getId());
        assertThat(userInDB.getHoxes().size()).isEqualTo(1);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_receiveHoxVM() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<HoxVM> responseEntity = postHOX(hox, HoxVM.class);
        assertThat(responseEntity.getBody().getUser().getUsername()).isEqualTo("user1");
    }

    // GET

    @Test
    public void getHoxes_whenThereAreNoHoxes_receiveOK() {
        ResponseEntity<Object> response = getHoxes(new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getHoxes_whenThereAreNoHoxes_receivePageWithZeroItems() {
        ResponseEntity<TestPage<Object>> response = getHoxes(new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getHoxes_whenThereAreHoxes_receivePageWithItems() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        ResponseEntity<TestPage<Object>> response = getHoxes(new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getHoxes_whenThereAreHoxes_receivePageWithHoxVM() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<TestPage<HoxVM>> response =
                getHoxes(new ParameterizedTypeReference<TestPage<HoxVM>>() {});
        HoxVM storedHoxVM = response.getBody().getContent().get(0);
        assertThat(storedHoxVM.getUser().getUsername()).isEqualTo("user1");
    }
}