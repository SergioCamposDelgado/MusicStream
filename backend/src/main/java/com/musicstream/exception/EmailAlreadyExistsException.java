//EmailAlreadyExistsException.java
package com.musicstream.exception;

public class EmailAlreadyExistsException extends RuntimeException {
 
 public EmailAlreadyExistsException(String message) {
     super(message);
 }
}